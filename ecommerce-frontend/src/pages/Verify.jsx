import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";

const Verify = () => {
  const [otp, setOtp] = useState();
  const { verifyUser } = UserData();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    await verifyUser(Number(otp), navigate);
  };
  return (
    <Container className="mt-4">
      <h2 className="mt-4">Verify Account</h2>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Enter Otp</Form.Label>
          <Form.Control
            type="number"
            placeholder="enter Otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit">Verify</Button> <br />
        <Link to="/login">go to login page</Link>
      </Form>
    </Container>
  );
};

export default Verify;
