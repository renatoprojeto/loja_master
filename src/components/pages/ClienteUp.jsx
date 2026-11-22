import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import UpdateCliente from './UpdateCliente';
import React from "react"

function Sobrepor({ clienteId, onSaved, ...props }) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            width="auto"
        >
            <Modal.Header closeButton id="btn">
                <Modal.Title id="contained-modal-title-vcenter">
                    Edição de Clientes
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <UpdateCliente id={clienteId} onSaved={onSaved} />
            </Modal.Body>
        </Modal>
    );
}

function ClienteUp({ id1 }) {
    const [modalShow, setModalShow] = React.useState(false);

    return (
        <>
            <Button className='botao' variant="primary" onClick={() => setModalShow(true)}>
                Editar
            </Button>

            <Sobrepor
                clienteId={id1}
                show={modalShow}
                onHide={() => setModalShow(false)}
                onSaved={() => {
                    setModalShow(false)
                    window.dispatchEvent(new Event('dados-atualizados'))
                }}
            />
        </>
    );
}

export default ClienteUp
