import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button'
import './Cadastro.css'
import React, { Component } from "react"
import axios from "axios"

class UpdateCliente extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.onInputchange = this.onInputchange.bind(this);
        this.cadastrar = this.cadastrar.bind(this);
        this.GetDados(props)
    }

    async GetDados(props) {
        try {
            const resp = await axios.get(`/clientes/${props.id}`)
            this.setState(resp.data)
        } catch (error) {
            console.error("Erro ao carregar cliente:", error)
            alert("Não foi possível carregar os dados do cliente.")
        }
    }

    onInputchange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    async cadastrar(e) {
        if (!e.currentTarget.form.reportValidity()) return

        try {
            await axios.put(`/clientes/${this.state.id}`, this.state)
            alert("Cliente atualizado")
        } catch (error) {
            console.error("Erro ao atualizar cliente:", error)
            alert("Não foi possível atualizar o cliente.")
            return
        }

        this.props.onSaved()
    }

    render() {
        return (
            <>
                <Form className='teste'>
                    <Form.Label class="label" column sm="2">
                        Nome
                    </Form.Label>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextName">
                        <Col>
                            <Form.Control name="nome" type="text" placeholder="Digite o nome do cliente" value={this.state.nome || ''} onChange={this.onInputchange} required />
                        </Col>
                    </Form.Group>

                    <Form.Label column sm="6">
                        Telefone
                    </Form.Label>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextTelefone">
                        <Col>
                            <Form.Control name="telefone" type="tel" placeholder="Digite o telefone" value={this.state.telefone || ''} onChange={this.onInputchange} required />
                        </Col>
                    </Form.Group>
                    <>
                        <Button className="botao" variant="primary" size="lg" active onClick={(e) => this.cadastrar(e)}>
                            Atualizar
                        </Button>
                    </>
                </Form>
            </>
        );
    }
}

export default UpdateCliente
