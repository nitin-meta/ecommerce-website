import { Spinner } from "react-bootstrap";

const Loader = () => {
  return (
    <div style={{ width: "100px", margin: "150px auto" }}>
      <Spinner
        animation="border"
        variant="warning"
        style={{ width: "70px", height: "70px" }}
      />
    </div>
  );
};

export default Loader;
