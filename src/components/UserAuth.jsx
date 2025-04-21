import React, { useState } from 'react';
import { User } from 'lucide-react';

const UserAuth = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setUser({
        name: formData.name,
        email: formData.email
      });
      setIsLoggedIn(true);
      setShowLogin(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="relative">
      {isLoggedIn ? (
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {getInitials(user.name)}
          </div>
          <span className="hidden md:inline text-sm text-gray-300">
            Hi, {user.name.split(' ')[0]}
          </span>
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

      {showLogin && (
        <div className="absolute right-0 mt-2 w-72 bg-gray-800/95 backdrop-blur-xl rounded-lg border border-emerald-500/20 shadow-2xl p-4 z-50">
          <h3 className="text-lg font-semibold text-emerald-400 mb-4">User Login</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-md text-sm"
              />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-md text-sm"
              />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-md text-sm"
              />
              {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-md text-sm"
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
  );
};

export default UserAuth;