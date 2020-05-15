import React, { useContext } from 'react';
import { Formik } from 'formik';
import {
    Navbar,
    Nav,
    Form,
    NavDropdown,
    Modal,
    Col,
    Button
} from 'react-bootstrap';
import { SettingContext, AppSettings } from '../../../../App';

declare type Props = {
    onHide(): void;
    show: boolean;
};

const SettingsModal: React.FC<Props> = ({ onHide, show }) => {
    return (
        <>
            <Modal
                size="lg"
                show={show}
                onHide={onHide}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Edit SDK settings:
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>...</Modal.Body>
            </Modal>
        </>
    );
};
export default SettingsModal;
