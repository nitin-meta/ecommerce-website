import React, { useEffect, useState } from "react";
import { CartData } from "../context/CartContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../main";
import { Button, Container, Image } from "react-bootstrap";
import { RiSecurePaymentLine } from "react-icons/ri";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const Payment = () => {
  const { cart, subTotal, fetchCart } = CartData();
  const [address, setAddress] = useState(null);
  const [method, setMethod] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const params = useParams();

  async function fetchAddress() {
    try {
      const { data } = await axios.get(`${server}/api/address/${params.id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setAddress(data.address);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchAddress();
  }, []);

  const paymentCod = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/order/new/cod`,
        {
          method,
          phone: address.phone,
          address: address.address,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      setLoading(false);
      toast.success(data.message);
      fetchCart();
      navigate("/ordersuccess");
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };
  const paymentOnline = async () => {
    setLoading(true);
    const {
      data: { order, orderOptions },
    } = await axios.post(
      `${server}/api/order/new/online`,
      {
        method,
        phone: address.phone,
        address: address.address,
      },
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );

    const options = {
      key: "rzp_test_yOMeMyaj2wlvTt",
      amount: order.subTotal,
      currency: "INR",
      name: "Let's Negotiate", //your business name
      description: "India will negotiate",
      order_id: order.id,
      handler: async function (response) {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
          response;

        try {
          const { data } = await axios.post(
            `${server}/api/payment`,
            {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
              orderOptions,
            },
            {
              headers: {
                token: localStorage.getItem("token"),
              },
            }
          );
          navigate("/ordersuccess");
          toast.success(data.message);
          fetchCart();
          setLoading(false);
        } catch (error) {
          toast.error(error.response.data.message);
          setLoading(false);
        }
      },

      theme: {
        color: "#9e1163",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Container>
          <h2>Proceed to Payment</h2>

          <h6>Products</h6>

          {cart &&
            cart.map((e, i) => (
              <div
                className="d-flex justify-content-center align-item-center"
                style={{
                  gap: "1rem",
                }}
                key={i}
              >
                <Image src={`${server}/${e.product.image}`} alt="" width={60} />
                <p>{e.product.title}</p>
                <p>₹{e.product.price}</p>
                <p>Quantity - {e.quantity}</p>
              </div>
            ))}

          <div className="mt-3"> total price to be paid - ₹{subTotal}</div>

          {address && (
            <div>
              <span>Address - {address.address}</span>
              <br />
              <span>Phone - {address.phone}</span>
            </div>
          )}

          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option>Choose Payment Method</option>
            <option value="cod">Cod</option>
            <option value="online">Online</option>
          </select>
          <br />
          <Button
            onClick={method === "cod" ? paymentCod : paymentOnline}
            className="mt-2"
          >
            Proceed <RiSecurePaymentLine />
          </Button>
        </Container>
      )}
    </>
  );
};

export default Payment;
