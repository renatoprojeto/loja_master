import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Alert from 'react-bootstrap/Alert'
import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button'
import './Cadastro.css'
import React, { Component } from "react"
import axios from "axios"

class CadastroVenda extends Component {
    state = {
        clientes: [],
        roupas: [],
        clienteId: '',
        clienteBusca: '',
        itens: [{ roupaId: '', quantidade: 1 }],
        desconto: '',
        erro: '',
        enviando: false
    }

    async componentDidMount() {
        try {
            const [clientes, roupas] = await Promise.all([
                axios.get('/clientes'),
                axios.get('/roupas')
            ])
            this.setState({ clientes: clientes.data, roupas: roupas.data })
        } catch (error) {
            console.error("Erro ao carregar dados para a venda:", error)
            this.setState({ erro: "Não foi possível carregar clientes e roupas para a venda." })
        }
    }

    selecionarCliente = (cliente) => {
        this.setState({ clienteId: cliente.id, clienteBusca: cliente.nome, erro: '' })
    }

    alterarItem = (index, campo, valor) => {
        this.setState(atual => ({
            itens: atual.itens.map((item, itemIndex) =>
                itemIndex === index ? { ...item, [campo]: valor } : item
            ),
            erro: ''
        }))
    }

    adicionarItem = () => {
        this.setState(atual => ({
            itens: [...atual.itens, { roupaId: '', quantidade: 1 }]
        }))
    }

    removerItem = (index) => {
        this.setState(atual => ({
            itens: atual.itens.filter((_, itemIndex) => itemIndex !== index)
        }))
    }

    cadastrar = async (event) => {
        event.preventDefault()
        if (!event.currentTarget.reportValidity()) return

        const { clienteId, itens, desconto, roupas } = this.state
        if (!clienteId) {
            this.setState({ erro: "Busque e selecione um cliente antes de cadastrar a venda." })
            return
        }

        const itensInvalidos = itens.some(item => !item.roupaId || Number(item.quantidade) < 1)
        if (itensInvalidos) {
            this.setState({ erro: "Selecione uma roupa e informe uma quantidade válida para cada item." })
            return
        }

        const quantidadesPorRoupa = new Map()
        for (const item of itens) {
            quantidadesPorRoupa.set(
                String(item.roupaId),
                (quantidadesPorRoupa.get(String(item.roupaId)) || 0) + Number(item.quantidade)
            )
        }
        const roupaSemEstoque = [...quantidadesPorRoupa].find(([roupaId, quantidade]) => {
            const roupa = roupas.find(item => String(item.id) === roupaId)
            return !roupa || quantidade > Number(roupa.quantidade)
        })
        if (roupaSemEstoque) {
            const roupa = roupas.find(item => String(item.id) === roupaSemEstoque[0])
            this.setState({
                erro: `Estoque insuficiente para "${roupa?.nomePeca || 'roupa selecionada'}". Disponível: ${roupa?.quantidade ?? 0}; solicitado: ${roupaSemEstoque[1]}.`
            })
            return
        }

        this.setState({ enviando: true, erro: '' })
        try {
            await axios.post('/vendas', {
                clienteId,
                itens: itens.map(item => ({
                    roupaId: item.roupaId,
                    quantidade: Number(item.quantidade)
                })),
                desconto: Number(desconto || 0)
            })
            alert("Venda cadastrada com sucesso.")
            window.dispatchEvent(new Event('dados-atualizados'))
            this.props.onSaved()
        } catch (error) {
            console.error("Erro ao cadastrar venda:", error)
            this.setState({
                erro: error.response?.data?.erro || "Não foi possível cadastrar a venda."
            })
        } finally {
            this.setState({ enviando: false })
        }
    }

    render() {
        const { clientes, roupas, clienteId, clienteBusca, itens, desconto, erro, enviando } = this.state
        const clientesFiltrados = clientes.filter(cliente =>
            `${cliente.nome} ${cliente.telefone}`.toLocaleLowerCase().includes(clienteBusca.toLocaleLowerCase())
        )
        const subtotal = itens.reduce((soma, item) => {
            const roupa = roupas.find(registro => String(registro.id) === String(item.roupaId))
            return soma + (Number(roupa?.valor) || 0) * (Number(item.quantidade) || 0)
        }, 0)
        const descontoNumerico = Number(desconto) || 0
        const total = Math.max(0, subtotal - descontoNumerico)
        const quantidadesSelecionadas = new Map()
        itens.forEach(item => {
            const roupaId = String(item.roupaId)
            quantidadesSelecionadas.set(
                roupaId,
                (quantidadesSelecionadas.get(roupaId) || 0) + (Number(item.quantidade) || 0)
            )
        })
        const estoqueInsuficiente = [...quantidadesSelecionadas].some(([roupaId, quantidade]) => {
            const roupa = roupas.find(registro => String(registro.id) === roupaId)
            return roupa && quantidade > Number(roupa.quantidade)
        })

        return (
            <Form className='teste' onSubmit={this.cadastrar}>
                <Form.Label class="label" column sm="6">Cliente</Form.Label>
                <Form.Group as={Row} className="mb-3" controlId="formVendaCliente">
                    <Col>
                        <Form.Control
                            type="search"
                            placeholder="Busque por nome ou telefone"
                            value={clienteBusca}
                            onChange={event => this.setState({
                                clienteBusca: event.target.value,
                                clienteId: '',
                                erro: ''
                            })}
                            required
                        />
                        {!clienteId && clienteBusca && (
                            <div className="d-flex flex-column mt-2">
                                {clientesFiltrados.length > 0 ? clientesFiltrados.map(cliente => (
                                    <Button
                                        key={cliente.id}
                                        type="button"
                                        variant="outline-secondary"
                                        className="mb-1"
                                        onClick={() => this.selecionarCliente(cliente)}
                                    >
                                        {cliente.nome} — {cliente.telefone}
                                    </Button>
                                )) : <span>Nenhum cliente encontrado.</span>}
                            </div>
                        )}
                        {clienteId && <Form.Text>Cliente selecionado: {clienteBusca}</Form.Text>}
                    </Col>
                </Form.Group>

                <Form.Label column sm="6">Itens da venda</Form.Label>
                {itens.map((item, index) => {
                    const roupaSelecionada = roupas.find(roupa => String(roupa.id) === String(item.roupaId))
                    return (
                        <Form.Group as={Row} className="mb-3 align-items-center" key={index}>
                            <Col>
                                <Form.Select
                                    aria-label="Selecione uma roupa"
                                    value={item.roupaId}
                                    onChange={event => this.alterarItem(index, 'roupaId', event.target.value)}
                                    required
                                >
                                    <option value="">Selecione uma roupa</option>
                                    {roupas.map(roupa => (
                                        <option key={roupa.id} value={roupa.id} disabled={Number(roupa.quantidade) === 0}>
                                            {roupa.nomePeca} — tamanho {roupa.tamanho} — {Number(roupa.quantidade)} em estoque
                                        </option>
                                    ))}
                                </Form.Select>
                                {roupaSelecionada && (
                                    <Form.Text>
                                        Preço unitário: {Number(roupaSelecionada.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </Form.Text>
                                )}
                            </Col>
                            <Col xs="4">
                                <Form.Control
                                    type="number"
                                    min="1"
                                    step="1"
                                    aria-label="Quantidade"
                                    value={item.quantidade}
                                    onChange={event => this.alterarItem(index, 'quantidade', event.target.value)}
                                    required
                                />
                            </Col>
                            <Col xs="auto">
                                <Button type="button" variant="outline-danger" disabled={itens.length === 1} onClick={() => this.removerItem(index)}>
                                    Remover
                                </Button>
                            </Col>
                        </Form.Group>
                    )
                })}

                <Button type="button" onClick={this.adicionarItem}>
                    Adicionar item
                </Button>

                {estoqueInsuficiente && (
                    <Alert variant="warning">
                        A quantidade informada excede o estoque disponível. Reduza a quantidade para continuar.
                    </Alert>
                )}
                {erro && <Alert variant="danger">{erro}</Alert>}

                <Form.Label column sm="6">Desconto</Form.Label>
                <Form.Group as={Row} className="mb-3" controlId="formVendaDesconto">
                    <Col>
                        <Form.Control
                            type="number"
                            min="0"
                            max={subtotal}
                            step="0.01"
                            placeholder="Informe o desconto (opcional)"
                            value={desconto}
                            onChange={event => this.setState({ desconto: event.target.value, erro: '' })}
                        />
                    </Col>
                </Form.Group>

                <p>Subtotal: {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                <p>Total: {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>

                <Button className="botao" variant="primary" size="lg" type="submit" disabled={enviando || estoqueInsuficiente}>
                    {enviando ? 'Cadastrando...' : 'Cadastrar venda'}
                </Button>
            </Form>
        )
    }
}

export default CadastroVenda
