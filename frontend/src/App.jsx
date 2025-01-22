import React from "react"
import {Box} from "@chakra-ui/react"; 
import {Routes, Route} from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import CartPage from "./pages/CartPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import OrdersPage from "./pages/OrdersPage";
import DeliverItemsPage from "./pages/DeliverItemsPage";


function App() {
  return (
  <Box minH="100vh">
    <Navbar />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />
      <Route path="/create" element={
        <ProtectedRoute>
          <CreatePage />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/cart" element={
    <ProtectedRoute>
        <CartPage />
    </ProtectedRoute>
     } />
     <Route path="/orders" element={
    <ProtectedRoute>
        <OrdersPage />
    </ProtectedRoute>
   } />
      <Route path="/deliver" element={
    <ProtectedRoute>
      <DeliverItemsPage />
    </ProtectedRoute>
    } />
     <Route path="/product/:id" element={
    <ProtectedRoute>
        <ProductDetailPage />
    </ProtectedRoute>
    } />
      <Route path="/search" element={
                    <ProtectedRoute>
                        <SearchPage />
                    </ProtectedRoute>
                } />
            
    </Routes>

  </Box>
  )
}

export default App;