import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Table } from "react-bootstrap";
import GerarDadosVenda from "../layout/GerarDadosVenda";
import CadVenda from "./CadVenda"

class RelVenda extends Component {
    componentDidMount() {
        document.title = "Vendas"
    }

    render() {
        return (
            <>
                <h1>Vendas</h1>
                <CadVenda />
                <hr style={{ width: "45vw" }}></hr>
                <Table responsive variant="dark" className="noWrap">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Cliente</th>
                            <th>Itens (tamanho e quantidade)</th>
                            <th>Desconto</th>
                            <th>Total</th>
                            <th>Data</th>
                            <th>Excluir</th>
                        </tr>
                    </thead>
                    <tbody id="corpo">
                        <GerarDadosVenda />
                    </tbody>
                </Table>
            </>
        );
    }
}

export default RelVenda
