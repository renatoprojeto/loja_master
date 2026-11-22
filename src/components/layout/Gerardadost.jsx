import React, { Component } from "react"
import axios from "axios";
import './Gerardadost.module.css'
import UserUp from '../pages/UserUp'
import Button from 'react-bootstrap/Button'
import UpdateUser from '../pages/UpdateUser'
import Teste from '../pages/UpdateUser'

var data

class GerarDadost extends Component {

    state = {
        usuarios: [],
    }

    constructor(props) {
        super(props)
        this.carregarUsuarios = this.carregarUsuarios.bind(this)
    }

    async componentDidMount() {
        window.addEventListener('dados-atualizados', this.carregarUsuarios)
        await this.carregarUsuarios()
    }

    componentWillUnmount() {
        window.removeEventListener('dados-atualizados', this.carregarUsuarios)
    }

    async carregarUsuarios() {
        try {
            const resp = await axios.get('/usuarios')
            this.setState({ usuarios: resp.data })
        } catch (error) {
            console.error("Erro ao carregar usuários:", error)
            alert("Não foi possível carregar os usuários.")
        }
    }

    async remove(id) {
        var url = "/usuarios/"
        url += id
        try {
            await axios.delete(url)
            this.setState(atual => ({
                usuarios: atual.usuarios.filter(usuario => usuario.id !== id)
            }))
        } catch (error) {
            console.error("Erro ao excluir usuário:", error)
            alert("Não foi possível excluir o usuário.")
        }
    }

    async update(id) {

        this.id = id
        UserUp(id)
        // url += id
        // const resp = await axios.get(url)
        // console.log(resp.data)
        // // await axios.put(url, user)

    }

    render() {

        const { usuarios } = this.state

        let i = 1;
        return (
            <>
                {usuarios.map(usuario => (
                    <tr key={usuario.id}>
                        <td>
                            {i++}
                        </td>
                        <td>
                            {usuario.nome}
                        </td>
                        <td>
                            {usuario.usuario}
                        </td>
                        <td><UserUp id1={usuario.id}/></td>
                        <td><Button type="button" className='botao2' onClick={() => this.remove(usuario.id)}>Excluir</Button></td>
                    </tr>
                ))}
            </>
        );
    }
}

export default GerarDadost
