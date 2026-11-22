import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import './Sidebar.css'
import Relatorio from "../pages/Relatorio"
import ReactDOM from 'react-dom/client'
import Dashboard from "../pages/Dashboard"
import NavDropdown from 'react-bootstrap/NavDropdown';
import RelRoupa from '../pages/RelRoupa'
import RelCliente from '../pages/RelCliente'
import RelVenda from '../pages/RelVenda'


class Sidebar extends Component {

    dash() {
        document.getElementById("rela").classList.remove('active')
        document.getElementById("dash").classList.add('active')

        ReactDOM.createRoot(document.getElementById('mainPage')).render(
            <React.StrictMode>
                <Dashboard />
            </React.StrictMode>
        )
    }

    relatar() {
        document.getElementById("rela").classList.add('active')
        document.getElementById("dash").classList.remove('active')
    }

    relUs() {
        ReactDOM.createRoot(document.getElementById('mainPage')).render(
            <React.StrictMode>
                <Relatorio />
            </React.StrictMode>
        )
    }

    relDis() {
        ReactDOM.createRoot(document.getElementById('mainPage')).render(
            <React.StrictMode>
                <RelRoupa />
            </React.StrictMode>
        )
    }

    relClientes() {
        ReactDOM.createRoot(document.getElementById('mainPage')).render(
            <React.StrictMode>
                <RelCliente />
            </React.StrictMode>
        )
    }

    relVendas() {
        ReactDOM.createRoot(document.getElementById('mainPage')).render(
            <React.StrictMode>
                <RelVenda />
            </React.StrictMode>
        )
    }

    render() {
        return (
            <div class="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark sidebar">
                <center>
                    <span class="fs-4">Bem-vindo</span>
                </center>
                <hr />
                <ul class="nav nav-pills flex-column mb-auto">
                    <li class="nav-item">
                        <a href="#" class="nav-link text-white active" aria-current="page" onClick={this.dash} id="dash">
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <NavDropdown
                            id="rela"
                            title="Relatórios"
                            menuVariant="dark"
                            class="letra"
                            onClick={this.relatar}
                        >
                            <NavDropdown.Item onClick={this.relUs}>Relatório de Usuários</NavDropdown.Item>
                            <NavDropdown.Item onClick={this.relClientes}>Relatório de Clientes</NavDropdown.Item>
                            <NavDropdown.Item onClick={this.relVendas}>Cadastrar Venda</NavDropdown.Item>
                            <NavDropdown.Item onClick={this.relDis}>
                                Relatório de Roupas
                            </NavDropdown.Item>
                        </NavDropdown>
                    </li>
                </ul>
                <hr />
            </div>
        );
    }
}

export default Sidebar