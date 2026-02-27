import { Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/web/Home";
import Gallery from "./pages/web/Gallary";
import Blog from "./pages/web/Blog";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import BlogPostPage from "./pages/web/BlogPostPage";
import { AdminDashboardProvider } from "./context/AdminDashboardContext";
import AdminLayout from "./layouts/AdminLayout";
import UpsertPost from "./pages/admin/UpsertPost";

function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="dashboard" element={<AdminDashboardProvider><AdminLayout><Dashboard /></AdminLayout></AdminDashboardProvider>} />
      <Route path="post/:id?" element={
        <AdminDashboardProvider>
          <AdminLayout>
            <UpsertPost />
          </AdminLayout>
        </AdminDashboardProvider>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
    <AdminAuthProvider>
    <Routes>
      {/* Public / web pages */}
      <Route path="/" element={<WebLayout><Home /></WebLayout>} />
      <Route path="/gallery" element={<WebLayout><Gallery /></WebLayout>} />
      <Route path="/blog" element={<WebLayout><Blog /></WebLayout>} />
      <Route path="/blog/:id" element={<WebLayout><BlogPostPage /></WebLayout>} />

      {/* Admin pages */}
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
    </AdminAuthProvider>
    </AppProvider>
  );
}

export default App;
