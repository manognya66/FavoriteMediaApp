import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddMedia from "./pages/AddMedia";
import MyMedia from "./pages/MyMedia";
import AuthPage from "./pages/AuthPage";
import EditMedia from "./pages/EditMedia";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/auth/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/add-media"
          element={
            <PrivateRoute>
              <AddMedia />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-media"
          element={
            <PrivateRoute>
              <MyMedia />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-media/:id"
          element={
            <PrivateRoute>
              <EditMedia />
            </PrivateRoute>
          }
        />
        <Route path="/auth/signup" element={<AuthPage />} />
        <Route path="/auth/login" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
