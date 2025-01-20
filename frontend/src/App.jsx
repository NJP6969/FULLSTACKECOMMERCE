import React from "react"
import {Box} from "@chakra-ui/react"; 
import {Routes, Route} from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import ProtectedRoute from './components/ProtectedRoute';

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
    </Routes>
  </Box>
  )
}

export default App;