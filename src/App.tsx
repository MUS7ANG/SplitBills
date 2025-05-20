import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Header from './components/Header';
import {Home} from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CreateProfile from './pages/CreateProfile';
import Meals from './pages/Meals';
import Meal from './pages/Meal';
import Cart from './pages/Cart';
import FamilyManagement from './pages/FamilyManagement';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
    return (
        <Router>
            <Header />
            <Container sx={{ mt: 4 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/create-profile"
                        element={
                            <ProtectedRoute>
                                <CreateProfile />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/meals" element={<Meals />} />
                    <Route path="/meal/:id" element={<Meal />} />
                    <Route
                        path="/cart"
                        element={
                            <ProtectedRoute>
                                <Cart />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/family"
                        element={
                            <ProtectedRoute>
                                <FamilyManagement />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Container>
        </Router>
    );
};

export default App;