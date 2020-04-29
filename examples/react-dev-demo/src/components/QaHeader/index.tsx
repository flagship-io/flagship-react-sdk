import React, { useContext } from 'react';
import { Navbar, Nav, Form, NavDropdown } from 'react-bootstrap';
import Logo from '../../assets/Flagship-horizontal-product-white.png';
import { AppSettings, SettingContext } from '../../App';
import SettingsModal from './components/SettingsModal';

const QaHeader: React.FC = () => {
    const { QA, setQA } = useContext(SettingContext) as AppSettings;
    if (!QA.enabled) {
        return null;
    }
    return (
        <>
            <Navbar className="fsNavbar qaHeader" fixed="top">
                <Navbar.Brand href="#" className="flex item-center">
                    QA Mode: <span className="green">Enabled</span>
                </Navbar.Brand>
                <Nav className="mr-auto fsNav">
                    {/* <Nav.Link
                        onClick={() =>
                            setQA({
                                ...QA,
                                show: { ...QA.show, settingsModal: true }
                            })
                        }
                    >
                        Edit settings
                    </Nav.Link> */}
                </Nav>

                <Form inline>
                    <Nav.Link onClick={() => setQA({ ...QA, enabled: false })}>
                        Switch off
                    </Nav.Link>
                </Form>
            </Navbar>
            <SettingsModal
                onHide={() =>
                    setQA({ ...QA, show: { ...QA.show, settingsModal: false } })
                }
                show={QA.show.settingsModal}
            ></SettingsModal>
        </>
    );
};
export default QaHeader;
