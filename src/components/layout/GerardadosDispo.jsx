import React, { Component } from "react"
import axios from "axios";
import './Gerardadost.module.css'
import DispoUp from "../pages/DispoUp";
import Button from 'react-bootstrap/Button'

var data

class GerardadosDispo extends Component {
    state = {
        roupas: [],
    }

    constructor(props) {
        super(props)
        this.carregarRoupas = this.carregarRoupas.bind(this)
    }

    async componentDidMount() {
        window.addEventListener('dados-atualizados', this.carregarRoupas)
        await this.carregarRoupas()
    }

    componentWillUnmount() {
        window.removeEventListener('dados-atualizados', this.carregarRoupas)
    }

    async carregarRoupas() {
        try {
            const resp = await axios.get('/roupas')
            this.setState({ roupas: resp.data })
        } catch (error) {
            console.error("Erro ao carregar roupas:", error)
            alert("Não foi possível carregar as roupas.")
        }
    }

    async remove(id){
        var url = "/roupas/"
        url += id
        try {
            await axios.delete(url)
            this.setState(atual => ({
                roupas: atual.roupas.filter(roupa => roupa.id !== id)
            }))
        } catch (error) {
            console.error("Erro ao excluir roupa:", error)
            alert("Não foi possível excluir a roupa.")
        }
    }

    async update(id) {

        this.id = id
        DispoUp(id)
    }

    render() {

        const { roupas } = this.state
        let i = 1;
        return (
        <>
            {roupas.map(roupa => (
                <tr key={roupa.id}>
                    <td>
                        {i++}
                    </td>
                    <td>
                        {roupa.nomePeca}
                    </td>
                    <td>
                        {roupa.tamanho}
                    </td>
                    <td>
                        {roupa.valor}
                    </td>
                    <td>
                        {roupa.quantidade}
                    </td>
                    <td><DispoUp id1={roupa.id}/></td>
                    <td><Button className='botao2' onClick={() => this.remove(roupa.id)}>Excluir</Button></td>
                </tr>
            ))}
        </>
        );
    }
}

export default GerardadosDispo
