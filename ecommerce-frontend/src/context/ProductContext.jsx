import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main";

const ProductContext = createContext();

export const ProductContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [page, setPage] = useState(1);
  const [adminProducts, setAdminProducts] = useState([]);
  async function fetchProducts() {
    try {
      const { data } = await axios.get(
        `${server}/api/product/all?search=${search}&category=${category}&price=${price}&page=${page}`
      );
      setProducts(data.products);
      setTopProducts(data.mostSelling);
      setTotalPages(data.totalPages);
      setCategories(data.categories);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function fetchAdminProducts() {
    try {
      const { data } = await axios.get(`${server}/api/product/admin/all`);
      setAdminProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchAdminProducts();
  }, [search, category, price, page]);
  return (
    <ProductContext.Provider
      value={{
        products,
        totalPages,
        topProducts,
        loading,
        categories,
        search,
        setSearch,
        category,
        setCategory,
        price,
        setPrice,
        page,
        setPage,
        adminProducts,
        fetchAdminProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const ProductData = () => useContext(ProductContext);
