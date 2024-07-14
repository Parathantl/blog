import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <div className="flex items-center space-x-2">
          <Image src="/facebook.png" alt="facebook" width={24} height={24} />
          <Image src="/instagram.png" alt="instagram" width={24} height={24} />
          <Image src="/tiktok.png" alt="tiktok" width={24} height={24} />
          <Image src="/youtube.png" alt="youtube" width={24} height={24} />
        </div>
        <div className="text-2xl md:text-3xl font-bold mt-2 md:mt-0">
          Parathan Blog
        </div>
        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          <Link href="/" className="hover:text-gray-300">Homepage</Link>
          <Link href="/contact" className="hover:text-gray-300">Contact</Link>
          <Link href="/about" className="hover:text-gray-300">About</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
