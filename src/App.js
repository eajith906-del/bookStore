import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Routing/AuthContext";
import { ShopProvider } from "./User/UserPages/BookStore/shopContext/ShopeContext";
import Routing from "./Routing/Routing";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ShopProvider>
          <Routing />
        </ShopProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;