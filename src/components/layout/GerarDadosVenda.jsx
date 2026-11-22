import React, { Component } from "react"
import axios from "axios";
import Button from 'react-bootstrap/Button'

const formatarMoeda = valor => Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
})

class GerarDadosVenda extends Component {
    state = {
        vendas: []
    }

    constructor(props) {
        super(props)
        this.carregarVendas = this.carregarVendas.bind(this)
    }

    async componentDidMount() {
        window.addEventListener('dados-atualizados', this.carregarVendas)
        await this.carregarVendas()
    }

    componentWillUnmount() {
        window.removeEventListener('dados-atualizados', this.carregarVendas)
    }

    async carregarVendas() {
        try {
            const resp = await axios.get('/vendas')
            this.setState({ vendas: resp.data })
        } catch (error) {
            console.error("Erro ao carregar vendas:", error)
            alert("Não foi possível carregar as vendas.")
        }
    }

    async excluirVenda(id) {
        if (!window.confirm("Deseja excluir esta venda e devolver os itens ao estoque?")) return

        try {
            await axios.delete(`/vendas/${id}`)
            this.setState(atual => ({
                vendas: atual.vendas.filter(venda => venda.id !== id)
            }))
            window.dispatchEvent(new Event('dados-atualizados'))
        } catch (error) {
            console.error("Erro ao excluir venda:", error)
            alert(error.response?.data?.erro || "Não foi possível excluir a venda e devolver os itens ao estoque.")
        }
    }

    render() {
        const { vendas } = this.state

        return (
            <>
                {[...vendas].reverse().map((venda, index) => (
                    <tr key={venda.id}>
                        <td>{vendas.length - index}</td>
                        <td>{venda.clienteNome}</td>
                        <td>{venda.itens.map(item => `${item.nomePeca} — tamanho ${item.tamanho || 'não informado'} (${item.quantidade})`).join(', ')}</td>
                        <td>{formatarMoeda(venda.desconto)}</td>
                        <td>{formatarMoeda(venda.total)}</td>
                        <td>{new Date(venda.data).toLocaleString('pt-BR')}</td>
                        <td>
                            <Button type="button" className='botao2' onClick={() => this.excluirVenda(venda.id)}>
                                Excluir
                            </Button>
                        </td>
                    </tr>
                ))}
            </>
        )
    }
}

export default GerarDadosVenda
