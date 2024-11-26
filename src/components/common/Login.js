import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from './Header'
import Footer from './Footer'
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(login({ username, password }))
      .unwrap()
      .then((resp) => {
        console.log(resp);
        localStorage.setItem("user", resp);
        navigate("/");
      })
      .catch(() => {
        console.log("wrong");
      });
  };

  return (
    <>
    <Header />
    <Container className="home-wrapper pe-0 pb-60 ps-0">
      <Row className="home-banner ">
        <Col>
          <Row className="banner-heading">Login</Row>
        </Col>
      </Row>
      <Row className="event-list">
        <Form
          style={{ width: "600px", paddingBottom: "60px" }}
          onSubmit={(e) => handleLogin(e)}
        >
          <Form.Group className="mb-3" controlId="formBasicTitle">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicDesc">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant="secondary" type="submit" style={{ float: "right" }}>
            Login
          </Button>
        </Form>
      </Row>
    </Container>
    <Footer />
    </>
  );
};
