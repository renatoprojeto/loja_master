import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Table } from "react-bootstrap";
import './Relatorio.css'
import GerardadosDispo from "../layout/GerardadosDispo";
import CadDispo from "./CadDispo"

class RelRoupa extends Component {
    render() {
        return (
            <>
                <h1>Relatório de Roupas</h1>
                <CadDispo />
                <hr style={{ width: "45vw" }}></hr>
                <Table responsive variant="dark" className="noWrap">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nome da peça</th>
                            <th>Tamanho</th>
                            <th>Valor</th>
                            <th>Quantidade</th>
                            <th>Editar</th>
                            <th>Excluir</th>
                        </tr>
                    </thead>
                    <tbody id="corpo">
                        <>
                            <GerardadosDispo />
                        </>
                    </tbody>
                </Table>
            </>
        );
    }
}

export default RelRoupa