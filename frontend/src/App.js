import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import UserLogin from "./pages/auth/UserLogin";
import AdminLogin from "./pages/auth/AdminLogin";
import Signup from "./pages/auth/Signup";
import AdminSignup from "./pages/auth/AdminSignup";

import BusList from "./pages/user/BusList";
import BusDetails from "./pages/user/BusDetails";
import MyTickets from "./pages/user/MyTickets";

import AdminDashboard from "./pages/admin/Dashboard";
import CreateBus from "./pages/admin/CreateBus";
import SalesReport from "./pages/admin/SalesReport";
import Locations from "./pages/admin/Locations";
import Journeys from "./pages/admin/Journeys";

import PrivateRoute from "./auth/PrivateRoute";
import AdminRoute from "./auth/AdminRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<UserLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />

          {/* User */}
          <Route element={<PrivateRoute />}>
            <Route path="/journeys" element={<BusList />} />
            <Route path="/journeys/:journeyId" element={<BusDetails />} />
            <Route path="/my-tickets" element={<MyTickets />} />
          </Route>

          {/* Admin */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/buses" element={<CreateBus />} />
            <Route path="/admin/locations" element={<Locations />} />
            <Route path="/admin/journeys" element={<Journeys />} />
            <Route path="/admin/sales" element={<SalesReport />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
