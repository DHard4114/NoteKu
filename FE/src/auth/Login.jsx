import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/user/login`,
        null,
        { params: { email, password } }
      );

      console.log("LOGIN RESPONSE:", response.data);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token || '');
        localStorage.setItem("user_id", response.data.payload.id);
        localStorage.setItem("email", email);

        setSuccessMessage('Login successful!');
        setErrorMessage('');

        navigate("/");
      } else {
        setSuccessMessage('');
        setErrorMessage(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error('There was an error during the login process!', error);
      setErrorMessage(error.response?.data?.message || "Something went wrong. Please try again.");
      setSuccessMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-lg">
        <h2 className="text-2xl font-mono text-center text-[#2da9b9]">Login</h2>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-[#111113]">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mt-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#2da9b9]"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-[#111113]">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mt-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#2da9b9]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 py-2 bg-[#2da9b9] text-white font-mono rounded-sm hover:bg-[#1b8c99] transition"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {errorMessage && (
          <p className="mt-4 text-red-500 text-center">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="mt-4 text-green-500 text-center">{successMessage}</p>
        )}

        <div className="mt-4 text-center">
          <p className="text-sm text-[#111113]">
            Don't have an account?{' '}
            <button
              onClick={handleNavigateToRegister}
              className="text-[#2da9b9] hover:underline"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
