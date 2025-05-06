import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const NavBar = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold font-mono text-[#2da9b9]">
        <Link to="/" className="flex items-center">
          Note<span className="text-[#303332]">Ku</span>
        </Link>
      </h1>

        <nav className="space-x-6 flex items-center">
          <Link to="/" className="text-[#111113] font-mono hover:text-[#52dd45] transition">
            Home
          </Link>
          <Link to="/notes" className="text-[#111113] font-mono hover:text-[#52dd45] transition">
            Lihat Catatan
          </Link>
          <Link to="/about" className="text-[#111113] font-mono hover:text-[#52dd45] transition">
            About
          </Link>

          <Link to="/login" className="flex items-center space-x-2 text-[#111113] hover:text-[#52dd45] transition">
            <LogIn size={20} />
            <span className="font-mono">Login</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
