import React from "react";
import errorImg from "./images/error-image.jpg";

const NotFound = () => {
  return (
    <div>
      <div className="d-flex justify-content-center align-content-center">
        <img src="..." alt="Not found illustration" />
      </div>
      <div className="d-flex justify-content-center">
        <h4>Could not find the page you are looking for...</h4>
      </div>
    </div>
  );
};

export default NotFound;
