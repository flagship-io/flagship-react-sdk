import React from 'react';
import { Navbar, Nav, Form, NavDropdown } from 'react-bootstrap';
import Logo from '../../assets/Flagship-horizontal-product-white.png';

const AppHeader: React.FC = () => (
    <>
        <Navbar className="fsNavbar" fixed="top">
            <Navbar.Brand
                href="https://github.com/abtasty/flagship-js-sdk"
                className="flex item-center"
            >
                <img
                    alt="Logo Flagship"
                    src={Logo}
                    className="d-inline-block align-top logoAdjust"
                />
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
                    <NavDropdown.Item eventKey="4.3" href="#useFsSynchronize">
                        useFsSynchronize
                    </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Features" id="nav-dropdown">
                    <NavDropdown.Item eventKey="4.0" href="#useFlagship">
                        Get modification(s)
                    </NavDropdown.Item>
                    <NavDropdown.Item eventKey="4.1" href="#useFsActivate">
                        Activate modification(s)
                    </NavDropdown.Item>
                    <NavDropdown.Item eventKey="4.2" href="#sendHits">
                        Send Hit(s)
                    </NavDropdown.Item>
                    <NavDropdown.Item eventKey="4.4" href="#safeMode">
                        Safe Mode
                    </NavDropdown.Item>
                </NavDropdown>
            </Nav>

            <Form inline>
                <Nav.Link href="https://github.com/abtasty/flagship-react-sdk">
                    Github
                </Nav.Link>
                <Nav.Link href="https://www.abtasty.com/solutions-product-teams/">
                    What is Flagship ?
                </Nav.Link>
            </Form>
        </Navbar>
    </>
);
export default AppHeader;
