import React from "react";
import {Container, Row, Col} from 'react-bootstrap';

function Footer() {

    return (
        <Container className = "footer-wrapper" fluid>
        <Container>
            <Row className="justify-content-between text-center mt-3">
                <Col className="footer-text">
                    
                        CopyRight 2024  © 
                                     
                </Col>
            </Row>
        </Container>
    </Container>
    );
}

export default Footer;