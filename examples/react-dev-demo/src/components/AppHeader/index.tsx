import React, { useContext } from 'react';
import { Navbar, Nav, Form, NavDropdown } from 'react-bootstrap';
import Logo from '../../assets/Flagship-horizontal-product-white.png';
import { AppSettings, SettingContext } from '../../App';

const AppHeader: React.FC = () => {
    const { QA, setQA } = useContext(SettingContext) as AppSettings;
    const okEmoji = '✅';
    return (
        <>
            <Navbar className="fsNavbar" fixed="top">
                <Navbar.Brand href="https://github.com/abtasty/flagship-react-sdk" className="flex item-center">
                    <img alt="Logo Flagship" src={Logo} className="d-inline-block align-top logoAdjust" />
                    React SDK (Dev demo)
                </Navbar.Brand>
                <Nav className="mr-auto fsNav">
                    <Nav.Link href="#initialization">Initialization</Nav.Link>
                    <NavDropdown title="Hooks" id="nav-dropdown">
                        <NavDropdown.Item eventKey="4.0" href="#useFlagship">
                            useFlagship
                        </NavDropdown.Item>
                        <NavDropdown.Item eventKey="4.1" href="#useFsModifications">
                            useFsModifications
                        </NavDropdown.Item>
                        <NavDropdown.Item eventKey="4.2" href="#useFsActivate">
                            useFsActivate
                        </NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Features" id="nav-dropdown">
                        <NavDropdown.Item eventKey="4.0" href="#useFlagship">
                            Get modification(s)
                        </NavDropdown.Item>
                        <NavDropdown.Item eventKey="4.5" href="#getModificationInfos">
                            Get modification Informations
                        </NavDropdown.Item>
                        <NavDropdown.Item eventKey="4.6" href="#startOrStopBucketing">
                            Start or stop manually bucketing polling
                        </NavDropdown.Item>
                        <NavDropdown.Item eventKey="4.1" href="#useFsActivate">
                            Activate modification(s)
                        </NavDropdown.Item>
                        <NavDropdown.Item eventKey="4.2" href="#sendHits">
                            Send Hit(s)
                        </NavDropdown.Item>
                        <NavDropdown.Item eventKey="4.3" href="#campaignsSynchronization">
                            Campaign synchronization
                        </NavDropdown.Item>
                        <NavDropdown.Item eventKey="4.4" href="#safeMode">
                            Safe Mode
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>

                <Form inline>
                    <NavDropdown title="QA mode" id="nav-dropdown">
                        <NavDropdown.Item eventKey="10.0" onClick={() => setQA({ ...QA, enabled: true })}>
                            ON {QA.enabled && okEmoji}
                        </NavDropdown.Item>
                        <NavDropdown.Item eventKey="10.1" onClick={() => setQA({ ...QA, enabled: false })}>
                            OFF {!QA.enabled && okEmoji}
                        </NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="https://github.com/abtasty/flagship-react-sdk">Github</Nav.Link>
                    <Nav.Link href="https://www.abtasty.com/solutions-product-teams/">What is Flagship ?</Nav.Link>
                </Form>
            </Navbar>
        </>
    );
};
export default AppHeader;
