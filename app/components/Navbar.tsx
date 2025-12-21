'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

const Navbar: React.FC = () => {
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('http://localhost:3001/auth/authstatus', {
        withCredentials: true,
      });

      if (response.data.status && response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3001/auth/logout', {}, {
        withCredentials: true,
      });
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-gray-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <Link href="/" className="text-2xl font-bold hover:text-blue-400 transition-colors">
            Parathan
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-blue-400 transition-colors">
              Home
            </Link>

            {/* Portfolio Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setPortfolioOpen(true)}
              onMouseLeave={() => setPortfolioOpen(false)}
            >
              <button className="hover:text-blue-400 transition-colors flex items-center py-2">
                Portfolio
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {portfolioOpen && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="w-48 bg-gray-700 rounded-lg shadow-xl py-2">
                    <Link
                      href="/portfolio"
                      className="block px-4 py-2 hover:bg-gray-600 transition-colors"
                      onClick={() => setPortfolioOpen(false)}
                    >
                      Overview
                    </Link>
                    <Link
                      href="/portfolio/about"
                      className="block px-4 py-2 hover:bg-gray-600 transition-colors"
                      onClick={() => setPortfolioOpen(false)}
                    >
                      About
                    </Link>
                    <Link
                      href="/portfolio/projects"
                      className="block px-4 py-2 hover:bg-gray-600 transition-colors"
                      onClick={() => setPortfolioOpen(false)}
                    >
                      Projects
                    </Link>
                    <Link
                      href="/portfolio/skills"
                      className="block px-4 py-2 hover:bg-gray-600 transition-colors"
                      onClick={() => setPortfolioOpen(false)}
                    >
                      Skills
                    </Link>
                    <Link
                      href="/portfolio/experience"
                      className="block px-4 py-2 hover:bg-gray-600 transition-colors"
                      onClick={() => setPortfolioOpen(false)}
                    >
                      Experience
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Blog Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setBlogOpen(true)}
              onMouseLeave={() => setBlogOpen(false)}
            >
              <button className="hover:text-blue-400 transition-colors flex items-center py-2">
                Blog
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {blogOpen && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="w-48 bg-gray-700 rounded-lg shadow-xl py-2">
                    <Link
                      href="/blog"
                      className="block px-4 py-2 hover:bg-gray-600 transition-colors"
                      onClick={() => setBlogOpen(false)}
                    >
                      All Posts
                    </Link>
                    <Link
                      href="/blog/tech"
                      className="block px-4 py-2 hover:bg-gray-600 transition-colors"
                      onClick={() => setBlogOpen(false)}
                    >
                      Tech Blog
                    </Link>
                    <Link
                      href="/blog/tamil"
                      className="block px-4 py-2 hover:bg-gray-600 transition-colors"
                      onClick={() => setBlogOpen(false)}
                    >
                      தமிழ் Blog
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/contact" className="hover:text-blue-400 transition-colors">
              Contact
            </Link>

            {/* Auth Section */}
            {loading ? (
              <div className="w-20 h-10 bg-gray-700 animate-pulse rounded-lg"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">
                  Hi, {user.firstname}
                </span>
                <Link
                  href="/admin"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className="block py-2 hover:text-blue-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            {/* Portfolio Mobile */}
            <div>
              <button
                className="w-full text-left py-2 hover:text-blue-400 transition-colors flex justify-between items-center"
                onClick={() => setPortfolioOpen(!portfolioOpen)}
              >
                Portfolio
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={portfolioOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                  />
                </svg>
              </button>
              {portfolioOpen && (
                <div className="pl-4 space-y-2">
                  <Link
                    href="/portfolio"
                    className="block py-2 text-gray-300 hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Overview
                  </Link>
                  <Link
                    href="/portfolio/about"
                    className="block py-2 text-gray-300 hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="/portfolio/projects"
                    className="block py-2 text-gray-300 hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Projects
                  </Link>
                  <Link
                    href="/portfolio/skills"
                    className="block py-2 text-gray-300 hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Skills
                  </Link>
                  <Link
                    href="/portfolio/experience"
                    className="block py-2 text-gray-300 hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Experience
                  </Link>
                </div>
              )}
            </div>

            {/* Blog Mobile */}
            <div>
              <button
                className="w-full text-left py-2 hover:text-blue-400 transition-colors flex justify-between items-center"
                onClick={() => setBlogOpen(!blogOpen)}
              >
                Blog
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={blogOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                  />
                </svg>
              </button>
              {blogOpen && (
                <div className="pl-4 space-y-2">
                  <Link
                    href="/blog"
                    className="block py-2 text-gray-300 hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    All Posts
                  </Link>
                  <Link
                    href="/blog/tech"
                    className="block py-2 text-gray-300 hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Tech Blog
                  </Link>
                  <Link
                    href="/blog/tamil"
                    className="block py-2 text-gray-300 hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    தமிழ் Blog
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className="block py-2 hover:text-blue-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>

            {/* Mobile Auth Section */}
            {loading ? (
              <div className="h-10 bg-gray-700 animate-pulse rounded-lg"></div>
            ) : user ? (
              <div className="space-y-2">
                <div className="py-2 text-gray-300">
                  Hi, {user.firstname}
                </div>
                <Link
                  href="/admin"
                  className="block py-2 px-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="block py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
