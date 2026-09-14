import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastConfig = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable
      theme="colored"
    />
  );
};

export default ToastConfig;
