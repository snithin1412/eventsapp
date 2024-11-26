import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "../components/Home/Home";
import { Login } from "../components/common/Login";
import { Booking } from "../components/Home/Booking";

function Navigator() {
  const PrivateRoute = ({ children }) => {
    const user = localStorage.getItem("user");
    if (user !== null && user !== undefined) {
      return children;
    } else {
      return <Navigate to="/login" />;
    }
  };
  const UnProtectedRoute = ({ children }) => {
    const user = localStorage.getItem("user");
    if (user === null || user === undefined) {
      return children;
    } else {
      return <Navigate to="/" />;
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/booking/:id"
        element={
          <PrivateRoute>
            <Booking />
          </PrivateRoute>
        }
      />
      <Route
        path="/login"
        element={
          <UnProtectedRoute>
            <Login />
          </UnProtectedRoute>
        }
      />
    </Routes>
  );
}

export default Navigator;
