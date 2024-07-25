import React from "react";
import { Container } from "react-bootstrap";
import BarChart from "../../components/BarChart";

const AllData = ({ products }) => {
  const title = products.map((product) => product.title);
  const sold = products.map((product) => product.sold);
  return (
    <Container>
      <h3>Products Sold</h3>
      <BarChart sold={sold} title={title} />
    </Container>
  );
};

export default AllData;
