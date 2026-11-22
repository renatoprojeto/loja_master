import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button'
import './Cadastro.css'
import React, { Component } from "react"
import axios from "axios"

class CadastroCliente extends Component {

    constructor() {
        super();
        this.state = {};
        this.onInputchange = this.onInputchange.bind(this);
        this.cadastrar = this.cadastrar.bind(this);
    }

    onInputchange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    async cadastrar(e) {
        if (!e.currentTarget.form.reportValidity()) return

        try {
            await axios.post("/clientes", this.state)
            alert("Cliente cadastrado")
        } catch (error) {
            console.error("Erro ao cadastrar cliente:", error)
            alert("Não foi possível cadastrar o cliente.")
            return
        }

        const botaoFechar = document.querySelector('.btn-close')
        if (botaoFechar) botaoFechar.click()
        window.dispatchEvent(new Event('dados-atualizados'))
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
                            Cadastrar
                        </Button>
                    </>
                </Form>
            </>
        );
    }
}

export default CadastroCliente
