import React, { useState, useContext } from 'react';
import { Coins, Search, User } from 'lucide-react';
import { CryptoContext } from '../context/CryptoContext';

const Navbar = () => {
    // Original search functionality state
    const [input, setInput] = useState('');
    const [filteredCoins, setFilteredCoins] = useState([]);
    const { cryptoList = [], setSearchTerm } = useContext(CryptoContext);

    // Login functionality state
    const [showLogin, setShowLogin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loginForm, setLoginForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [errors, setErrors] = useState({});

    // Original search handlers
    const searchHandler = (event) => {
        event.preventDefault();
        setSearchTerm(input);
        setFilteredCoins([]);
    };

    const inputHandler = (event) => {
        const value = event.target.value;
        setInput(value);
      
        if (value === "") {
            setSearchTerm("");
            setFilteredCoins([]);
        } else {
            const suggestions = cryptoList.filter((coin) => 
                coin.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredCoins(suggestions.slice(0, 5));
        }
    };

    // Login handlers
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginForm({
            ...loginForm,
            [name]: value
        });
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Name validation
        if (!loginForm.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        // Email validation
        if (!loginForm.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        // Phone validation (supports international numbers)
        if (!loginForm.phone.trim()) {
            newErrors.phone = 'Phone is required';
        } else if (!/^(\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/.test(loginForm.phone)) {
            newErrors.phone = 'Enter a valid phone number';
        }
        
        // Password validation
        if (!loginForm.password) {
            newErrors.password = 'Password is required';
        } else if (loginForm.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoggedIn(true);
            setUser({
                name: loginForm.name,
                email: loginForm.email,
                phone: loginForm.phone
            });
            setShowLogin(false);
            setLoginForm({
                name: '',
                email: '',
                phone: '',
                password: ''
            });
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <nav className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 px-[5%] md:px-[8%] lg:px-[18%] py-5 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/30 sticky top-0 z-50">
            {/* Logo */}
            <a href="/" className="order-1 flex-shrink-0 flex items-center gap-2 hover:scale-105 transition-transform">
                <Coins className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    CryptoTracker
                </span>
            </a>

            {/* Search Form */}
            <form onSubmit={searchHandler} className="order-3 w-full md:order-2 md:w-auto flex-1 max-w-2xl mx-0 md:mx-4 relative">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600/40 to-cyan-500/40 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"/>
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            placeholder="Search Crypto..."
                            value={input}
                            onChange={inputHandler}
                            required
                            className="w-full px-6 py-3 bg-gray-800/60 border border-gray-600/30 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder-gray-400 text-gray-200 backdrop-blur-sm"
                        />
                        <button type='submit' className='z-10 relative right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-full hover:scale-105 transition-all'>
                            <Search className='w-4 h-4 pointer-events-none' />
                        </button>
                    </div>
                </div>
                
                {filteredCoins.length > 0 && (
                    <ul className="absolute w-full bg-gray-800/95 border border-gray-700 mt-2 rounded-lg shadow-xl z-10 backdrop-blur-md">
                        {filteredCoins.map((coin, idx) => (
                            <li 
                                key={idx} 
                                className="px-4 py-2 hover:bg-emerald-600/30 cursor-pointer text-gray-100"
                                onClick={() => {
                                    setInput(coin.name);
                                    setFilteredCoins([]);
                                }}
                            >
                                {coin.name}
                            </li>
                        ))}
                    </ul>
                )}
            </form>

            {/* User Auth Section */}
            <div className="order-2 md:order-3 relative">
                {isLoggedIn ? (
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {getInitials(user.name)}
                        </div>
                        <span className="hidden md:inline text-sm text-gray-300">
                            Hi, {user.name.split(' ')[0]}
                        </span>
                        <button 
                            onClick={handleLogout}
                            className="ml-2 text-xs text-gray-400 hover:text-emerald-400 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => setShowLogin(true)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-800/60 hover:bg-gray-700/80 rounded-full border border-emerald-500/30 transition-colors"
                    >
                        <User className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm">Login</span>
                    </button>
                )}

                {/* Login Modal */}
                {showLogin && (
                    <div className="absolute right-0 mt-2 w-72 bg-gray-800/95 backdrop-blur-xl rounded-lg border border-emerald-500/20 shadow-2xl p-4 z-50">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-emerald-400">User Login</h3>
                            <button 
                                onClick={() => setShowLogin(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleLoginSubmit} className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={loginForm.name}
                                    onChange={handleLoginChange}
                                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-sm"
                                />
                                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={loginForm.email}
                                    onChange={handleLoginChange}
                                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-sm"
                                />
                                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={loginForm.phone}
                                    onChange={handleLoginChange}
                                    placeholder="e.g. 123-456-7890 or +1 234 567 8900"
                                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-sm"
                                />
                                {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={loginForm.password}
                                    onChange={handleLoginChange}
                                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-sm"
                                />
                                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-md hover:opacity-90 transition-opacity"
                            >
                                Login
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;