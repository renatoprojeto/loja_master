import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Table } from "react-bootstrap";
import GerarDadosCliente from "../layout/GerarDadosCliente";
import CadCliente from "./CadCliente"

class RelCliente extends Component {

    componentDidMount() {
        document.title = "Relatório de Clientes"
    }

    render() {
        return (
            <>
                <h1>Relatório de Clientes</h1>
                <CadCliente />
                <hr style={{ width: "45vw" }}></hr>
                <Table responsive variant="dark" className="noWrap">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nome</th>
                            <th>Telefone</th>
                            <th>Editar</th>
                            <th>Excluir</th>
                        </tr>
                    </thead>
                    <tbody id="corpo">
                        <GerarDadosCliente />
                    </tbody>
                </Table>
            </>
        );
    }
}

export default RelCliente
