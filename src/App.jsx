import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Products from './pages/Products'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/layout/Navbar'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Orders from './pages/Orders'
import { AuthProvider } from './context/AuthContext'
import ErrorNotification from './components/ErrorNotification'
import './styles/ErrorNotification.css'

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <ErrorNotification />
      <div className='container'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
