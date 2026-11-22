import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button'
import './Cadastro.css'
import React, { Component } from "react"
import axios from "axios"


class UpdateRoupa extends Component {

    constructor(id) {
        super();
        this.state = {
        };
        this.onInputchange = this.onInputchange.bind(this);
        this.cadastrar = this.cadastrar.bind(this);
        this.GetDados(id)
    }

    async GetDados(id){

        var url = "/roupas/"
        url += id.id;

        console.log(url)

        const resp = await axios.get(url);
        this.setState(resp.data);
    }


    onInputchange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    async cadastrar(e) {

        if (!e.currentTarget.form.reportValidity()) return

        let url = "/roupas/"
        let form = {
            ...this.state,
            valor: Number(this.state.valor),
            quantidade: Number(this.state.quantidade)
        };

        url += form.id;
        console.log(form);

        try {
            await axios.put(url, form)
            alert("Roupa atualizada")


        } catch (error) {
            console.error("Erro ao atualizar roupa:", error)
            alert("Não foi possível atualizar a roupa.")
            return
        }

        document.querySelector('.btn-close').click()
        window.dispatchEvent(new Event('dados-atualizados'))
    }

    render() {
        return (
            <>
                <Form className='teste'>
                    <center>
                        <Form.Label style={{display:'inline'}} class="label" column sm="2">
                            Nome da peça
                        </Form.Label>
                        <Form.Group as={Row} className="mb-3" controlId="formPlaintextName">
                            <Col>
                                <Form.Control style={{width: '250px' }} name="nomePeca" type="text" placeholder="Digite o nome da peça" value={this.state.nomePeca || ''} onChange={this.onInputchange} required />
                            </Col>
                        </Form.Group>

                        <Form.Label column sm="6">
                            Tamanho
                        </Form.Label>
                        <Form.Group as={Row} className="mb-3" controlId="formPlaintextUser">
                            <Col>
                                <Form.Control name="tamanho" type="text" placeholder="Digite o tamanho" value={this.state.tamanho || ''} onChange={this.onInputchange} required />
                            </Col>
                        </Form.Group>

                        <Form.Label column sm="6">
                            Valor
                        </Form.Label>
                        <Form.Group as={Row} className="mb-3" controlId="formPlaintextUser">
                            <Col>
                                <Form.Control size='lg' name="valor" type="number" min="0" step="0.01" placeholder="Digite o valor" value={this.state.valor ?? ''} onChange={this.onInputchange} required />
                            </Col>
                        </Form.Group>

                        <Form.Label column sm="6">
                            Quantidade
                        </Form.Label>
                        <Form.Group as={Row} className="mb-3" controlId="formPlaintextQuantity">
                            <Col>
                                <Form.Control size='lg' name="quantidade" type="number" min="0" step="1" placeholder="Digite a quantidade" value={this.state.quantidade ?? ''} onChange={this.onInputchange} required />
                            </Col>
                        </Form.Group>
                        <>
                            <Button className="botao" variant="primary" size="lg" active onClick={(e) => this.cadastrar(e)}>
                                Atualizar
                            </Button>
                        </>
                    </center>
                </Form>
            </>
        );
    }
}

export default UpdateRoupa