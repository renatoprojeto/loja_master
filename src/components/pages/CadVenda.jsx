import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CadastroVenda from './CadastroVenda';
import React from "react"

function CadVenda() {
    const [modalShow, setModalShow] = React.useState(false);

    return (
        <>
            <Button className='botao' variant="primary" onClick={() => setModalShow(true)}>
                Cadastrar Venda
            </Button>

            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                size="lg"
                aria-labelledby="cadastro-venda-titulo"
                centered
                scrollable
            >
                <Modal.Header closeButton id="btn">
                    <Modal.Title id="cadastro-venda-titulo">Cadastro de Venda</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CadastroVenda onSaved={() => setModalShow(false)} />
                </Modal.Body>
            </Modal>
        </>
    );
}

export default CadVenda
