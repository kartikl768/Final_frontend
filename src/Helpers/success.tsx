import Lottie from "lottie-react";
import animationData from "../assets/Success (2).json"; 

const success = () => {
  return (
    <div style={{ width: 450, height: 400 }}>
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};