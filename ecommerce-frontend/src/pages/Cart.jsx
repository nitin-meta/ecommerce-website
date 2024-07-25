import { Container, Table, Button } from "react-bootstrap";
import { CartData } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { server } from "../main";
import { IoBagCheckOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

const Cart = () => {
  const { cart, subTotal, updateCart, removeFromCart } = CartData();

  const updateCartHandler = async (action, id) => {
    await updateCart(action, id);
  };
  const navigate = useNavigate();
  return (
    <Container>
      <h2 className="mt-4 mb-3">Shopping Cart</h2>
      {cart && cart.length > 0 ? (
        <div>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Price</th>
                <th>image</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {cart.map((e, i) => (
                <tr key={i}>
                  <th>{i + 1}</th>
                  <th>{e.product.title}</th>
                  <th>₹{e.product.price}</th>

                  <td>
                    <Link to={`/product/${e.product._id}`}>
                      <img
                        src={`${server}/${e.product.image}`}
                        style={{ width: "60px" }}
                        alt=""
                      />
                    </Link>
                  </td>
                  <td>
                    <Button
                      onClick={() => updateCartHandler("dec", e._id)}
                      className="mx-2"
                    >
                      -
                    </Button>
                    {e.quantity}
                    <Button
                      onClick={() => updateCartHandler("inc", e._id)}
                      className="mx-2"
                    >
                      +
                    </Button>
                  </td>
                  <td>₹{e.product.price * e.quantity}</td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => removeFromCart(e._id)}
                    >
                      <MdDelete />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <p>No Items in Cart</p>
      )}

      {subTotal === 0 ? (
        ""
      ) : (
        <div className="bottom">
          <h2>Subtotal</h2>
          <p>total price to be Paid - ₹ {subTotal}</p>
          <Button
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => navigate("/checkout")}
          >
            Checkout <IoBagCheckOutline />
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Cart;
