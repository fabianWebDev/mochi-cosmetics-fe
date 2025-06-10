import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home/Home'
import Products from './pages/Products/Products'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import { Layout } from './components'
import Contact from './pages/Contact/Contact'
import ProductDetail from './pages/ProductDetail/ProductDetail'
import Cart from './pages/Cart/Cart'
import Checkout from './pages/Checkout/Checkout'
import OrderConfirmation from './pages/OrderConfirmation/OrderConfirmation'
import Orders from './pages/Orders/Orders'
import { AuthProvider } from './context/AuthContext'
const { Navbar, Footer } = Layout
import About from './pages/About/About'
import OrderDetail from './pages/OrderDetail/OrderDetail'
import PasswordResetRequestPage from './pages/PasswordReset/PasswordResetRequestPage'
import PasswordResetConfirmPage from './pages/PasswordReset/PasswordResetComfirmPage'
import Profile from './pages/Profile/Profile'

function App() {
  return (
    <AuthProvider>
      <div className='page-container'>
        <Navbar />
        <div className='content-wrap container'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="/orders/:orderId" element={<OrderDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/password-reset" element={<PasswordResetRequestPage />} />
            <Route path="/reset-password" element={<PasswordResetConfirmPage />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App
