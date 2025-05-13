import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import TattooDetail from './pages/TattooDetail';
import HowItWorks from './pages/HowItWorks';
import Manifesto from './pages/Manifesto';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import RewardsStore from './pages/RewardsStore';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import { TattooProvider } from './context/TattooContext';
import { AuthProvider } from './context/AuthContext';
import { InkPointsProvider } from './context/InkPointsContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <InkPointsProvider>
          <WishlistProvider>
            <CartProvider>
              <TattooProvider>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/tattoo/:id" element={<TattooDetail />} />
                      <Route path="/how-it-works" element={<HowItWorks />} />
                      <Route path="/manifesto" element={<Manifesto />} />
                      <Route path="/checkout/:id" element={<Checkout />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<SignUp />} />
                      <Route 
                        path="/profile" 
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/rewards" 
                        element={
                          <ProtectedRoute>
                            <RewardsStore />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/wishlist" 
                        element={
                          <ProtectedRoute>
                            <Wishlist />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/cart" 
                        element={
                          <ProtectedRoute>
                            <Cart />
                          </ProtectedRoute>
                        } 
                      />
                    </Routes>
                  </main>
                  <Footer />
                  <Toaster position="top-right" />
                </div>
              </TattooProvider>
            </CartProvider>
          </WishlistProvider>
        </InkPointsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;