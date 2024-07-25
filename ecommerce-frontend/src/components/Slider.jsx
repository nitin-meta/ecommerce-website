import { Carousel } from "react-bootstrap";

const Slider = () => {
  return (
    <Carousel>
      <Carousel.Item>
        <img src="/img 1.jpg" alt="img" className="d-block w-100" />
      </Carousel.Item>
      <Carousel.Item>
        <img src="/img 2.jpg" alt="img" className="d-block w-100" />
      </Carousel.Item>
      <Carousel.Item>
        <img src="/img 3.jpg" alt="img" className="d-block w-100" />
      </Carousel.Item>
    </Carousel>
  );
};

export default Slider;
