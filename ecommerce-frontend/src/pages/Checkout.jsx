import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Button, Row, Card, Modal, Form } from "react-bootstrap";
import { server } from "../main";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Checkout = () => {
  const [show, setShow] = useState(false);
  const [address, setAddress] = useState([]);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  async function fetchAddress() {
    try {
      const { data } = await axios.get(`${server}/api/address/all`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setAddress(data.alladdress);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchAddress();
  }, []);

  const navigate = useNavigate();

  const deleteHandler = async (id) => {
    if (confirm("Are you sure you want to delete this address!")) {
      try {
        const { data } = await axios.delete(`${server}/api/address/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        fetchAddress();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <Container>
      <h1>Choose Address</h1>
      <Button onClick={handleShow}>Add Address</Button>
      <AddressModal
        handleShow={handleShow}
        show={show}
        setShow={setShow}
        handleClose={handleClose}
        fetchAddress={fetchAddress}
      />

      <Row className="justify-content-center" style={{ gap: "1rem" }}>
        {address && address.length > 0 ? (
          address.map((e, i) => (
            <Card key={i} style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>
                  Address - {i + 1} {"  "}{" "}
                  <Button onClick={() => deleteHandler(e._id)} variant="danger">
                    <MdDelete />
                  </Button>
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  <p>Address - {e.address}</p>
                </Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">
                  <p>Phone - {e.phone}</p>
                </Card.Subtitle>

                <Button onClick={() => navigate(`/payment/${e._id}`)}>
                  Use Address
                </Button>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>No Address Yet</p>
        )}
      </Row>
    </Container>
  );
};

export default Checkout;

const AddressModal = ({
  handleClose,
  handleShow,
  show,
  setShow,
  fetchAddress,
}) => {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  async function submitHandler(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${server}/api/address/new`,
        { address, phone },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data.message) {
        toast.success(data.message);
        fetchAddress();
        setShow(false);
        setAddress("");
        setPhone("");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Address</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Phone"
              minLength={10}
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit">Add Address</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
