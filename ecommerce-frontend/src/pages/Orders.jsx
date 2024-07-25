import { Container, Table, Button } from "react-bootstrap";
import axios from "axios";
import { server } from "../main";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  async function fetchOrders() {
    try {
      const { data } = await axios.get(`${server}/api/order/all`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setOrders(data.orders);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);
  return (
    <Container>
      <h1>All Orders</h1>
      {orders && orders.length > 0 ? (
        <Table responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Method</th>
              <th>Subtotal</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

            {orders.map((e, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{e.method}</td>
                <td>{e.subTotal}</td>
                <td>{e.status}</td>
                <td>
                  <Button onClick={() => navigate(`/order/${e._id}`)}>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </thead>
        </Table>
      ) : (
        <p>No Orders Yet</p>
      )}
    </Container>
  );
};

export default Orders;
