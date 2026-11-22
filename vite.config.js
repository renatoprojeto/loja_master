import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const arquivoDados = fileURLToPath(new URL('./src/data/db.json', import.meta.url))
let filaOperacoesDados = Promise.resolve()

async function lerDados() {
  return JSON.parse(await readFile(arquivoDados, 'utf8'))
}

async function salvarDados(dados) {
  await writeFile(arquivoDados, `${JSON.stringify(dados, null, 2)}\n`, 'utf8')
}

async function lerCorpo(requisicao) {
  let conteudo = ''
  for await (const trecho of requisicao) {
    conteudo += trecho
  }
  return JSON.parse(conteudo || '{}')
}

function responder(resposta, codigo, dados) {
  resposta.statusCode = codigo
  resposta.setHeader('Content-Type', 'application/json; charset=utf-8')
  resposta.end(JSON.stringify(dados))
}

function executarEmSequencia(operacao) {
  const resultado = filaOperacoesDados.then(operacao)
  filaOperacoesDados = resultado.catch(() => {})
  return resultado
}

function pluginDadosJson() {
  return {
    name: 'dados-json',
    configureServer(servidor) {
      servidor.middlewares.use(async (requisicao, resposta, proximo) => {
        const caminho = new URL(requisicao.url, 'http://localhost').pathname
        const partes = caminho.split('/').filter(Boolean)
        const recurso = partes[0]

        if (!['usuarios', 'roupas', 'clientes', 'vendas'].includes(recurso)) {
          proximo()
          return
        }

        await executarEmSequencia(async () => {
          try {
            const dados = await lerDados()

            const colecao = dados[recurso]
            if (!Array.isArray(colecao)) {
              responder(resposta, 404, { erro: 'Coleção não encontrada.' })
              return
            }

            if (partes.length === 1 && requisicao.method === 'GET') {
              responder(resposta, 200, colecao)
              return
            }

            if (recurso === 'vendas' && partes.length === 1 && requisicao.method === 'POST') {
              const venda = await lerCorpo(requisicao)
              const desconto = Number(venda?.desconto ?? 0)
              if (
                !venda ||
                typeof venda !== 'object' ||
                Array.isArray(venda) ||
                venda.clienteId === undefined ||
                !Array.isArray(venda.itens) ||
                venda.itens.length === 0 ||
                !Number.isFinite(desconto) ||
                desconto < 0
              ) {
                responder(resposta, 400, { erro: 'Os dados da venda são inválidos. Informe o cliente, os itens e um desconto válido.' })
              return
              }

              const cliente = dados.clientes.find(item => String(item.id) === String(venda.clienteId))
              if (!cliente) {
                responder(resposta, 400, { erro: 'O cliente selecionado não foi encontrado.' })
                return
              }

              const quantidades = new Map()
              for (const item of venda.itens) {
                const quantidade = Number(item?.quantidade)
                if (
                  item?.roupaId === undefined ||
                  !Number.isSafeInteger(quantidade) ||
                  quantidade <= 0
                ) {
                  responder(resposta, 400, { erro: 'Cada item da venda deve ter uma roupa e uma quantidade inteira maior que zero.' })
                  return
                }
                const roupaId = String(item.roupaId)
                quantidades.set(roupaId, (quantidades.get(roupaId) || 0) + quantidade)
              }

              const itensVenda = []
              let subtotalCentavos = 0
              for (const [roupaId, quantidade] of quantidades) {
                const roupa = dados.roupas.find(item => String(item.id) === roupaId)
                if (!roupa) {
                  responder(resposta, 400, { erro: 'Uma das roupas selecionadas não foi encontrada. Atualize a tela e tente novamente.' })
                  return
                }

                const estoque = Number(roupa.quantidade)
                const valor = Number(roupa.valor)
                if (!Number.isSafeInteger(estoque) || estoque < 0 || !Number.isFinite(valor) || valor < 0) {
                  responder(resposta, 500, { erro: `O estoque ou o valor de "${roupa.nomePeca}" está inválido no cadastro.` })
                  return
                }
                if (quantidade > estoque) {
                  responder(resposta, 409, {
                    erro: `Estoque insuficiente para "${roupa.nomePeca}". Disponível: ${estoque}; solicitado: ${quantidade}.`
                  })
                  return
                }

                const valorCentavos = Math.round(valor * 100)
                subtotalCentavos += valorCentavos * quantidade
                itensVenda.push({
                  roupaId: roupa.id,
                  nomePeca: roupa.nomePeca,
                  tamanho: roupa.tamanho,
                  quantidade,
                  valorUnitario: valorCentavos / 100
                })
              }

              const descontoCentavos = Math.round(desconto * 100)
              if (
                !Number.isSafeInteger(subtotalCentavos) ||
                !Number.isSafeInteger(descontoCentavos) ||
                descontoCentavos > subtotalCentavos
              ) {
                responder(resposta, 400, { erro: 'O desconto não pode ser maior que o subtotal da venda.' })
                return
              }

              const proximoId = Math.max(0, ...colecao.map(item => Number(item.id) || 0)) + 1
              const vendaSalva = {
                id: proximoId,
                clienteId: cliente.id,
                clienteNome: cliente.nome,
                itens: itensVenda,
                subtotal: subtotalCentavos / 100,
                desconto: descontoCentavos / 100,
                total: (subtotalCentavos - descontoCentavos) / 100,
                data: new Date().toISOString()
              }

              for (const item of vendaSalva.itens) {
                const roupa = dados.roupas.find(registro => String(registro.id) === String(item.roupaId))
                roupa.quantidade = Number(roupa.quantidade) - item.quantidade
              }
              colecao.push(vendaSalva)
              await salvarDados(dados)
              responder(resposta, 201, vendaSalva)
              return
            }

            if (partes.length === 1 && requisicao.method === 'POST') {
              const novoItem = await lerCorpo(requisicao)
              if (!novoItem || typeof novoItem !== 'object' || Array.isArray(novoItem)) {
                responder(resposta, 400, { erro: 'Os dados enviados são inválidos.' })
                return
              }
              const proximoId = Math.max(0, ...colecao.map(item => Number(item.id) || 0)) + 1
              const itemSalvo = { ...novoItem, id: novoItem.id ?? proximoId }
              colecao.push(itemSalvo)
              await salvarDados(dados)
              responder(resposta, 201, itemSalvo)
              return
            }

            if (partes.length === 2) {
              const id = decodeURIComponent(partes[1])
              const indice = colecao.findIndex(item => String(item.id) === id)

              if (indice < 0) {
                responder(resposta, 404, { erro: 'Registro não encontrado.' })
                return
              }

              if (requisicao.method === 'GET') {
                responder(resposta, 200, colecao[indice])
                return
              }

              if (requisicao.method === 'PUT') {
                const itemAtualizado = await lerCorpo(requisicao)
                if (!itemAtualizado || typeof itemAtualizado !== 'object' || Array.isArray(itemAtualizado)) {
                  responder(resposta, 400, { erro: 'Os dados enviados são inválidos.' })
                  return
                }
                colecao[indice] = { ...itemAtualizado, id: colecao[indice].id }
                await salvarDados(dados)
                responder(resposta, 200, colecao[indice])
                return
              }

              if (requisicao.method === 'DELETE') {
                if (recurso === 'vendas') {
                  const venda = colecao[indice]
                  if (!Array.isArray(venda.itens) || venda.itens.length === 0) {
                    responder(resposta, 409, { erro: 'Não foi possível devolver o estoque: os itens da venda estão inválidos.' })
                    return
                  }

                  const devolucoes = new Map()
                  for (const item of venda.itens) {
                    const quantidade = Number(item.quantidade)
                    if (item.roupaId === undefined || !Number.isSafeInteger(quantidade) || quantidade <= 0) {
                      responder(resposta, 409, { erro: 'Não foi possível devolver o estoque: um item da venda está inválido.' })
                      return
                    }
                    const roupaId = String(item.roupaId)
                    devolucoes.set(roupaId, (devolucoes.get(roupaId) || 0) + quantidade)
                  }

                  const roupasDevolvidas = []
                  for (const [roupaId, quantidade] of devolucoes) {
                    const roupa = dados.roupas.find(item => String(item.id) === roupaId)
                    if (!roupa) {
                      responder(resposta, 409, { erro: 'Não foi possível excluir a venda porque uma roupa relacionada não existe mais no cadastro.' })
                      return
                    }
                    const estoque = Number(roupa.quantidade)
                    if (!Number.isSafeInteger(estoque) || estoque < 0 || !Number.isSafeInteger(estoque + quantidade)) {
                      responder(resposta, 409, { erro: `Não foi possível devolver ao estoque a roupa "${roupa.nomePeca}" porque sua quantidade está inválida.` })
                      return
                    }
                    roupasDevolvidas.push({ roupa, quantidade })
                  }

                  for (const { roupa, quantidade } of roupasDevolvidas) {
                    roupa.quantidade = Number(roupa.quantidade) + quantidade
                  }
                  const [vendaRemovida] = colecao.splice(indice, 1)
                  await salvarDados(dados)
                  responder(resposta, 200, vendaRemovida)
                  return
                }

                const [itemRemovido] = colecao.splice(indice, 1)
                await salvarDados(dados)
                responder(resposta, 200, itemRemovido)
                return
              }
            }

            responder(resposta, 405, { erro: 'Método não permitido.' })
          } catch (erro) {
            console.error('Erro ao acessar o arquivo db.json:', erro)
            responder(resposta, 500, { erro: 'Não foi possível acessar ou atualizar o arquivo db.json.' })
          }
        })
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), pluginDadosJson()]
})
