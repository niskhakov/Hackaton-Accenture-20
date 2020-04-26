import React from "react";
import { Link } from "react-router-dom";
import { Button, Container, Row } from "react-bootstrap";

const Layout = ({ children }) => {
  return (
    <Container>
      <Row className="my-2 justify-content-center">
        <Link to="/">
          <Button variant="primary" className="m-1">
            Groups
          </Button>
        </Link>

        <Link to="/raw">
          <Button variant="danger" className="m-1">
            Raw Data
          </Button>
        </Link>
      </Row>

      {children}
    </Container>
  );
};

export default Layout;
