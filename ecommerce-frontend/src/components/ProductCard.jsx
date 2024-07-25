import { Button, Card, ListGroup } from "react-bootstrap";
import { server } from "../main";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { ProductData } from "../context/ProductContext";

const ProductCard = ({ product, admin }) => {
  const navigate = useNavigate();

  const { fetchAdminProducts } = ProductData();

  const deleteHandler = async () => {
    if (confirm("Are you sure you want to delete this product")) {
      try {
        const { data } = await axios.delete(
          `${server}/api/product/${product._id}`,
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );

        toast.success(data.message);
        fetchAdminProducts();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };
  return (
    <Card style={{ width: "18rem", marginTop: "20px" }}>
      <Card.Img
        variant="top"
        src={`${server}/${product.image}`}
        style={{ height: "300px" }}
      />
      <Card.Body>
        <Card.Title>{product.title}</Card.Title>
        <Card.Text>{product.description}</Card.Text>
      </Card.Body>

      <ListGroup className="list-group-flush">
        <ListGroup.Item>₹ {product.price}</ListGroup.Item>
      </ListGroup>

      <Card.Body>
        <Button onClick={() => navigate(`/product/${product._id}`)}>
          View Product
        </Button>
        {admin && (
          <Button onClick={deleteHandler} className="mx-2" variant="danger">
            Delete
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
