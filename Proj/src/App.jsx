import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NotificationProvider } from "./NotificationContext";
import Navbar from "./Navbar";
import Hero from "./Hero";
import CivicConnect from "./CivicConnect";
import AdminLogin from "./AdminLogin";
import UserLogin from "./UserLogin";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";
import Working from "./Working";
import { ReportsProvider } from "./ReportsContext";

export default function App() {
  return (
      <NotificationProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />


          <Routes>
            {/* Home Page */}
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <CivicConnect />
                  <Working />
                </>
              }
            />


            {/* Admin Login Page */}
            <Route path="/admin-login" element={<AdminLogin />} />


            {/* User Login Page */}
            <Route path="/user-login" element={<UserLogin />} />

            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />

          </Routes>
        </div>
      </NotificationProvider>
  );
}