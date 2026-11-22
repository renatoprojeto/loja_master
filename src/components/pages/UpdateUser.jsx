import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button'
import './Cadastro.css'
import React, { Component } from "react"
import axios from "axios"


class UpdateUser extends Component {

    constructor(id) {
        super();
        this.state = {
        };
        this.onInputchange = this.onInputchange.bind(this);
        this.cadastrar = this.cadastrar.bind(this);
        this.GetDados(id)
    }

    async GetDados(id){

        var url = "/usuarios/"
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

    async cadastrar() {

        let url = "/usuarios/"
        let form = this.state;

        url += form.id;
        console.log(form);

        try {
            await axios.put(url, form)
            alert("Usuário atualizado")


        } catch (error) {
            console.log(error)
        }

        document.querySelector('.btn-close').click()
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
                            <Form.Control name="nome" type="text" placeholder="Digite o Nome" value={this.state.nome} onChange={this.onInputchange} />
                        </Col>
                    </Form.Group>

                    <Form.Label column sm="6">
                        Usuário
                    </Form.Label>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextUser">
                        <Col>
                            <Form.Control name="usuario" type="text" placeholder="Digite seu Usuário" value={this.state.usuario} onChange={this.onInputchange} />
                        </Col>
                    </Form.Group>

                    <>
                        <Button className="botao" variant="primary" size="lg" active onClick={() => this.cadastrar()}>
                           Atualizar
                        </Button>
                    </>
                </Form>

            </>
        );
    }
}

export default UpdateUser