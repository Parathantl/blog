import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <div className="bg-gray-800 text-white p-5">
      <div className="flex flex-col md:flex-row justify-between items-center container mx-auto">
        <div className="flex items-center mb-4 md:mb-0">
          {/* <Image src="/logo.png" alt="Parathan blog" width={50} height={50} /> */}
          <h1 className="text-2xl font-bold ml-2">Parathan Blog</h1>
        </div>
        <p className="max-w-md text-center md:text-left mb-4 md:mb-0">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim necessitatibus similique aspernatur obcaecati veritatis. Aperiam cum porro sequi, totam minima consequuntur, aspernatur deleniti vero repellendus.
        </p>
        <div className="flex space-x-2">
          <Image src="/facebook.png" alt="Facebook" width={18} height={18} />
          <Image src="/instagram.png" alt="Instagram" width={18} height={18} />
          <Image src="/tiktok.png" alt="Tiktok" width={18} height={18} />
          <Image src="/youtube.png" alt="YouTube" width={18} height={18} />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <span className="font-semibold">Links</span>
          <ul className="mt-2">
            <li><Link href="/" className="hover:text-gray-300">Homepage</Link></li>
            <li><Link href="/blog" className="hover:text-gray-300">Blog</Link></li>
            <li><Link href="/about" className="hover:text-gray-300">About</Link></li>
            <li><Link href="/contact" className="hover:text-gray-300">Contact</Link></li>
          </ul>
        </div>
        <div>
          <span className="font-semibold">Tags</span>
          <ul className="mt-2">
            <li><Link href="/tags/style" className="hover:text-gray-300">Style</Link></li>
            <li><Link href="/tags/fashion" className="hover:text-gray-300">Fashion</Link></li>
            <li><Link href="/tags/coding" className="hover:text-gray-300">Coding</Link></li>
            <li><Link href="/tags/travel" className="hover:text-gray-300">Travel</Link></li>
          </ul>
        </div>
        <div>
          <span className="font-semibold">Social</span>
          <ul className="mt-2">
            <li><Link href="https://facebook.com" className="hover:text-gray-300">Facebook</Link></li>
            <li><Link href="https://instagram.com" className="hover:text-gray-300">Instagram</Link></li>
            <li><Link href="https://tiktok.com" className="hover:text-gray-300">Tiktok</Link></li>
            <li><Link href="https://youtube.com" className="hover:text-gray-300">Youtube</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
