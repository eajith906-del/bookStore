import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Routing/AuthContext";
import { ShopProvider } from "./User/UserPages/BookStore/shopContext/ShopeContext";
import Routing from "./Routing/Routing";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ShopProvider>
          <Routing />
        </ShopProvider>
      </AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;