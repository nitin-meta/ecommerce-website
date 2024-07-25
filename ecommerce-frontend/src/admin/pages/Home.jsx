import React, { useState } from "react";
import { Button, Container, Form, Modal, Row } from "react-bootstrap";
import ProductCard from "../../components/ProductCard";
import { ProductData } from "../../context/ProductContext";
import { server } from "../../main";
import toast from "react-hot-toast";
import axios from "axios";

const Home = ({ products }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { fetchAdminProducts } = ProductData();
  return (
    <Container>
      <h3>All Products</h3>
      <AddProduct
        handleClose={handleClose}
        show={show}
        setShow={setShow}
        fetchAdminProducts={fetchAdminProducts}
      />
      <Button onClick={handleShow}>Add Products +</Button>
      <Row className="justify-content-center" style={{ gap: "1rem" }}>
        {products &&
          products.map((i) => (
            <ProductCard key={i._id} admin={true} product={i} />
          ))}
      </Row>
    </Container>
  );
};

export default Home;

const AddProduct = ({
  handleClose,
  handleShow,
  show,
  setShow,
  fetchAdminProducts,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");

  const categories = [
    "SmartPhone",
    "Laptop",
    "Groccesary",
    "T Shirt",
    "Footwear",
  ];

  const changeImageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  async function submitHandler(e) {
    e.preventDefault();

    const myForm = new FormData();

    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("stock", stock);
    myForm.append("price", price);
    myForm.append("category", category);
    myForm.append("image", image);
    try {
      const { data } = await axios.post(`${server}/api/product/new`, myForm, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (data.message) {
        toast.success(data.message);
        fetchAdminProducts();
        setShow(false);
        setTitle("");
        setDescription("");
        setStock("");
        setPrice("");
        setImage("");
        setCategory("");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Select Category</option>
            {categories.map((e) => (
              <option value={e} key={e}>
                {e}
              </option>
            ))}
          </Form.Select>
          <input
            className="my-4"
            type="file"
            onChange={changeImageHandler}
            required
          />
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit">Add Product</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
