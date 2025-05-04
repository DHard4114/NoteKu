import React from 'react';

const HomePage = () => {
  const userEmail = localStorage.getItem('email') || 'User';

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f7f9fa]">
      <h1 className="text-3xl font-mono text-[#2da9b9] mb-4">Welcome, {userEmail}!</h1>
      <p className="text-gray-700 mb-8">You have successfully logged in to the system.</p>
      
      <button
        onClick={handleLogout}
        className="px-6 py-2 bg-[#2da9b9] text-white font-mono rounded-sm hover:bg-[#1b8c99] transition"
      >
        Logout
      </button>
    </div>
  );
};

export default HomePage;
