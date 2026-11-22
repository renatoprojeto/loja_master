import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Col, Form, Row, Table, Alert } from 'react-bootstrap'
import axios from "axios"

const formatarMoeda = valor => Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
})

const dataLocal = data => {
    const ano = data.getFullYear()
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const dia = String(data.getDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}`
}

class Dashboard extends Component {
    state = {
        vendas: [],
        dataInicial: '',
        dataFinal: '',
        erro: ''
    }

    componentDidMount() {
        document.title = "Dashboard"
        window.addEventListener('dados-atualizados', this.carregarVendas)
        this.carregarVendas()
    }

    componentWillUnmount() {
        window.removeEventListener('dados-atualizados', this.carregarVendas)
    }

    carregarVendas = async () => {
        try {
            const resp = await axios.get('/vendas')
            this.setState({ vendas: resp.data, erro: '' })
        } catch (error) {
            console.error("Erro ao carregar vendas do dashboard:", error)
            this.setState({ erro: "Não foi possível carregar o relatório de vendas." })
        }
    }

    render() {
        const { vendas, dataInicial, dataFinal, erro } = this.state
        const periodoInvalido = dataInicial && dataFinal && dataInicial > dataFinal
        const vendasFiltradas = vendas.filter(venda => {
            const dataVenda = new Date(venda.data)
            if (Number.isNaN(dataVenda.getTime())) return false
            const diaVenda = dataLocal(dataVenda)
            return (!dataInicial || diaVenda >= dataInicial) &&
                (!dataFinal || diaVenda <= dataFinal)
        })
        const totalVendido = vendasFiltradas.reduce((total, venda) => total + (Number(venda.total) || 0), 0)

        return (
            <>
                <h1>Dashboard</h1>
                <hr style={{ width: "45vw" }}></hr>
                <h4>Relatório de Vendas</h4>

                <Form className="mb-3">
                    <Row className="align-items-end">
                        <Col xs={12} md={4}>
                            <Form.Group controlId="dashboardDataInicial">
                                <Form.Label>Data inicial</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={dataInicial}
                                    max={dataFinal || undefined}
                                    onChange={event => this.setState({ dataInicial: event.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} md={4}>
                            <Form.Group controlId="dashboardDataFinal">
                                <Form.Label>Data final</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={dataFinal}
                                    min={dataInicial || undefined}
                                    onChange={event => this.setState({ dataFinal: event.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} md={4}>
                            <button
                                type="button"
                                className="btn btn-outline-primary mb-3"
                                onClick={() => this.setState({ dataInicial: '', dataFinal: '' })}
                            >
                                Limpar período
                            </button>
                        </Col>
                    </Row>
                </Form>

                {erro && <Alert variant="danger">{erro}</Alert>}
                {periodoInvalido && <Alert variant="warning">A data inicial não pode ser posterior à data final.</Alert>}

                <p>
                    Vendas no período: {periodoInvalido ? 0 : vendasFiltradas.length}
                    {' | '}
                    Total vendido: {formatarMoeda(periodoInvalido ? 0 : totalVendido)}
                </p>

                <Table responsive variant="dark" className="noWrap">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Cliente</th>
                            <th>Itens (tamanho e quantidade)</th>
                            <th>Desconto</th>
                            <th>Total</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!periodoInvalido && [...vendasFiltradas].reverse().map((venda, index) => (
                            <tr key={venda.id}>
                                <td>{vendasFiltradas.length - index}</td>
                                <td>{venda.clienteNome}</td>
                                <td>{venda.itens.map(item => `${item.nomePeca} — tamanho ${item.tamanho || 'não informado'} (${item.quantidade})`).join(', ')}</td>
                                <td>{formatarMoeda(venda.desconto)}</td>
                                <td>{formatarMoeda(venda.total)}</td>
                                <td>{new Date(venda.data).toLocaleString('pt-BR')}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </>
        );
    }
}

export default Dashboard
