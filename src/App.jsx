import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Products from './pages/Products'
import Login from './pages/Login'
import Register from './pages/Register'
import { Layout } from './components'
import Contact from './pages/Contact'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Orders from './pages/Orders'
import { AuthProvider } from './context/AuthContext'
const { Navbar, Footer } = Layout
import About from './pages/About'
import OrderDetal from './pages/OrderDetal'
import { PasswordResetRequest } from './components/auth/passwordReset'
import { PasswordResetConfirm } from './components/auth/passwordReset'

function App() {
  return (
    <AuthProvider>
      <div className='page-container'>
        <Navbar />
        <div className='content-wrap container'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="/orders/:orderId" element={<OrderDetal />} />
            <Route path="/about" element={<About />} />
            <Route path="/password-reset" element={<PasswordResetRequest />} />
            <Route path="/reset-password" element={<PasswordResetConfirm />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App
