import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { server } from "../main";

const OrderPage = () => {
  const [order, setOrder] = useState([]);
  const params = useParams();
  async function fetchOrder() {
    try {
      const { data } = await axios.get(`${server}/api/order/${params.id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setOrder(data.order);
    } catch (error) {
      console.log(error);
    }
  }

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrder();
  }, []);
  return (
    <>
      {order && (
        <Container>
          <h3 className="text-center my-2 text-danger">
            OrderId - {order._id}
          </h3>

          <h4 className="text-center my-2 text-primary">Products</h4>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Price</th>
                <th>Image</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items &&
                order.items.map((e, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{e.product.title}</td>
                    <td>₹{e.product.price}</td>
                    <td>
                      <Link to={`/product/${e.product._id}`}>
                        <img
                          src={`${server}/${e.product.image}`}
                          alt=""
                          width={60}
                        />
                      </Link>
                    </td>
                    <td>{e.quantity}</td>
                    <td>₹ {e.product.price * e.quantity}</td>
                  </tr>
                ))}
            </tbody>
          </Table>

          <h5 className="text-center my-2 text-primary">
            Subtotal - ₹{order.subTotal}
          </h5>
          <h5 className="text-center my-2 text-primary">
            Payment Method - {order.method}
          </h5>
          <h5 className="text-center my-2 text-primary">
            Status - {order.status}
          </h5>
          {order.paymentInfo && (
            <h5 className="text-center my-2 text-primary">
              paymentId - {order.paymentInfo}
            </h5>
          )}
          <p className="text-center">
            <Button onClick={() => navigate("/orders")}>Go Back</Button>
          </p>
        </Container>
      )}
    </>
  );
};

export default OrderPage;
