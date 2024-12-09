import { Provider } from "react-redux";
import { store } from "./redux/store"; // Импортируй store
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Header from "./components/Header/Header";
import Product from "./components/Product/Product";
import ProductInfo from "./components/ProductInfo/ProductInfo";
import CreateProduct from "./components/CreateProduct/CreateProduct";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Product />} />
            <Route path="/product/:id" element={<ProductInfo />} />
            <Route path="/create-product" element={<CreateProduct />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
