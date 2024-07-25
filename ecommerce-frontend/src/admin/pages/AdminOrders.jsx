import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../main";
import { Button, Table } from "react-bootstrap";
import toast from "react-hot-toast";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  async function fetchOrders() {
    try {
      const { data } = await axios.get(`${server}/api/order/admin/all`, {
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

  const updateStatus = async (id) => {
    if (confirm("Are you sure you want to update status of this order")) {
      setLoading(true);
      try {
        const { data } = await axios.put(
          `${server}/api/order/${id}`,
          {},
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );

        toast.success(data.message);
        fetchOrders();
        setLoading(false);
      } catch (error) {
        toast.error(error.response.data.message);
        setLoading(false);
      }
    }
  };

  const totalSubtotal = orders.reduce(
    (total, order) => total + order.subTotal,
    0
  );
  return (
    <div>
      <h4>Total Revenue - ₹{totalSubtotal}</h4>
      {orders && orders.length > 0 ? (
        <Table striped bordered responsive hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Adress</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          {orders.map((e, i) => (
            <tbody>
              <tr>
                <td>{i + 1}</td>
                <td>{e.address}</td>
                <td>{e.subTotal}</td>
                <td>{e.status}</td>
                <td>
                  {e.status === "Delivered" ? (
                    <p className="text-success">Order Delivered</p>
                  ) : (
                    <Button
                      disabled={loading}
                      onClick={() => updateStatus(e._id)}
                    >
                      Update Status
                    </Button>
                  )}
                </td>
              </tr>
            </tbody>
          ))}
        </Table>
      ) : (
        <p>No Orders Yet!</p>
      )}
    </div>
  );
};

export default AdminOrders;
