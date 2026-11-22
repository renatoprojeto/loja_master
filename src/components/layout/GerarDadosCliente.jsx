import React, { Component } from "react"
import axios from "axios";
import './Gerardadost.module.css'
import ClienteUp from '../pages/ClienteUp'
import Button from 'react-bootstrap/Button'

class GerarDadosCliente extends Component {

    state = {
        clientes: [],
    }

    constructor(props) {
        super(props)
        this.carregarClientes = this.carregarClientes.bind(this)
    }

    async componentDidMount() {
        window.addEventListener('dados-atualizados', this.carregarClientes)
        await this.carregarClientes()
    }

    componentWillUnmount() {
        window.removeEventListener('dados-atualizados', this.carregarClientes)
    }

    async carregarClientes() {
        try {
            const resp = await axios.get('/clientes')
            this.setState({ clientes: resp.data })
        } catch (error) {
            console.error("Erro ao carregar clientes:", error)
            alert("Não foi possível carregar os clientes.")
        }
    }

    async remove(id) {
        try {
            await axios.delete(`/clientes/${id}`)
            this.setState(atual => ({
                clientes: atual.clientes.filter(cliente => cliente.id !== id)
            }))
        } catch (error) {
            console.error("Erro ao excluir cliente:", error)
            alert("Não foi possível excluir o cliente.")
        }
    }

    render() {
        const { clientes } = this.state

        return (
            <>
                {clientes.map((cliente, index) => (
                    <tr key={cliente.id}>
                        <td>{index + 1}</td>
                        <td>{cliente.nome}</td>
                        <td>{cliente.telefone}</td>
                        <td><ClienteUp id1={cliente.id} /></td>
                        <td><Button type="button" className='botao2' onClick={() => this.remove(cliente.id)}>Excluir</Button></td>
                    </tr>
                ))}
            </>
        );
    }
}

export default GerarDadosCliente
