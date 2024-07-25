import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [totalItem, setTotalItem] = useState(0);
  const [subTotal, setSubTotal] = useState(0);

  const [cart, setCart] = useState([]);
  async function fetchCart() {
    try {
      const { data } = await axios.get(`${server}/api/cart/all`, {
        headers: {
          token,
        },
      });

      setCart(data.cart);
      setTotalItem(data.sumofQuantities);
      setSubTotal(data.subTotal);
    } catch (error) {
      console.log(error);
    }
  }

  async function addToCart(product) {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/cart/new`,
        { product },
        {
          headers: {
            token,
          },
        }
      );

      if (data.message) {
        toast.success(data.message);
        fetchCart();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function updateCart(action, id) {
    try {
      const { data } = await axios.put(
        `${server}/api/cart?action=${action}`,
        { id },
        {
          headers: {
            token,
          },
        }
      );

      fetchCart();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function removeFromCart(id) {
    try {
      const { data } = await axios.delete(`${server}/api/cart/${id}`, {
        headers: {
          token,
        },
      });

      toast.success(data.message);
      fetchCart();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    fetchCart();
  }, []);
  return (
    <CartContext.Provider
      value={{
        cart,
        totalItem,
        subTotal,
        addToCart,
        updateCart,
        removeFromCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const CartData = () => useContext(CartContext);
