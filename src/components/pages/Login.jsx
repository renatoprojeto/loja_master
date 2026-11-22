import Header from '../layout/Header'
import Footer from '../layout/Footer'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/esm/Container'
import Button from 'react-bootstrap/Button'
import './login.css'
import React, { Component } from "react"
import axios from "axios"
import Menu from '../layout/Menu'

class Login extends Component {

    state = {
        usuarios: [],
        autenticado: false,
    }

    async componentDidMount() {
        document.title = "Login"
        try {
            const resposta = await axios.get('/usuarios')
            this.setState({ usuarios: resposta.data })
        } catch (erro) {
            console.error("Erro ao carregar usuários para login:", erro)
            alert("Não foi possível carregar os dados de login.")
        }
    }

    constructor() {
        super();
        this.onInputchange = this.onInputchange.bind(this);
        this.verificar_senha = this.verificar_senha.bind(this);
    }

    onInputchange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    verificar_senha() {
        let p1 = 0;
        let a = 0;

        for (let i = 0; i < this.state.usuarios.length; i++) {
            if (this.state['usuario']?.toLowerCase() == this.state.usuarios[i]['usuario'].toLowerCase()) {
                p1 = i;
                a = 1;
            }
        }

        if (a == 0) {
            alert("Usuario Errado")
        }

        if (a == 1) {
            if (this.state['senha'] == this.state.usuarios[p1]['senha']) {
                this.setState({ autenticado: true })
            } else {
                alert("Senha incorreta")

            }
        }
    }

    render() {
        if (this.state.autenticado) {
            return <Menu />
        }

        return (
            
            <div className="App" style={{backgroundImage: `url(/src/assets/logo.jpeg) `, backgroundSize: 'cover', backgroundPosition: '50% 50%'}}>

                <>
                    <Header />
                    <br />
                    <br />
                        <Container>
                            <br />
                            <h2 class="titulo">Fazer Login</h2>
                            <Form>
                                <Form.Label class="label" column sm="2">
                                    Usuário
                                </Form.Label>
                                <Form.Group as={Row} className="mb-3" controlId="formPlaintextUser">
                                    <Col>
                                        <Form.Control name="usuario" type="text" placeholder="Digite seu usuário" value={this.state.usuario || ''} onChange={this.onInputchange} />
                                    </Col>
                                </Form.Group>

                                <Form.Label column sm="2">
                                    Senha
                                </Form.Label>
                                <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                                    <Col>
                                        <Form.Control name="senha" type="password" placeholder="Senha" value={this.state.senha || ''} onChange={this.onInputchange} />
                                    </Col>
                                </Form.Group>
                                <>
                                    <Button className="botao" variant="primary" size="lg" active onClick={this.verificar_senha}>
                                        Entrar
                                    </Button>
                                </>

                            </Form>
                        </Container>
                    <Footer />
                </>
            </div>
        );
    }
}

export default Login
