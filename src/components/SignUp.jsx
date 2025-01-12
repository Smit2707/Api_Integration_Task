import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    country: '',
    gender: '',
    dob: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('SignUp component mounted');
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Submitting form data:', formData);

    try {
      const response = await axios.post(
        'https://interview-task-bmcl.onrender.com/api/user/add_user',
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Registration Response:', response.data);

      if (response.data.success) {
        alert('Registration successful!');
        navigate('/login');
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(
        error.response?.data?.message || 
        'Registration failed. Please check your input and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full px-4 py-2.5 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400 text-gray-600";
  const labelStyle = "block text-sm font-medium text-[#555] mb-2";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-3">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-center text-[#333] mb-6">
          Create your account
        </h2>

        {error && (
          <div className="mb-4 p-2.5 bg-red-50 text-red-500 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className={labelStyle}>Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Your Name"
                className={inputStyle}
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className={labelStyle}>Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="example@email.com"
                className={inputStyle}
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="mobile" className={labelStyle}>Mobile Number</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                required
                pattern="[0-9]{10}"
                placeholder="10-digit mobile number"
                className={inputStyle}
                value={formData.mobile}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className={labelStyle}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength="6"
                placeholder="********"
                className={inputStyle}
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className={labelStyle}>Address</label>
            <textarea
              id="address"
              name="address"
              required
              rows="2"
              placeholder="Enter your full address"
              className={inputStyle}
              value={formData.address}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pincode" className={labelStyle}>Pincode</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                required
                pattern="[0-9]{6}"
                placeholder="6-digit pincode"
                className={inputStyle}
                value={formData.pincode}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="gender" className={labelStyle}>Gender</label>
              <select
                id="gender"
                name="gender"
                required
                className={inputStyle}
                value={formData.gender}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="city" className={labelStyle}>City</label>
              <input
                type="text"
                id="city"
                name="city"
                required
                placeholder="Your City"
                className={inputStyle}
                value={formData.city}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="state" className={labelStyle}>State</label>
              <input
                type="text"
                id="state"
                name="state"
                required
                placeholder="Your State"
                className={inputStyle}
                value={formData.state}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="country" className={labelStyle}>Country</label>
              <input
                type="text"
                id="country"
                name="country"
                required
                placeholder="Your Country"
                className={inputStyle}
                value={formData.country}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="dob" className={labelStyle}>Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                required
                className={inputStyle}
                value={formData.dob}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;