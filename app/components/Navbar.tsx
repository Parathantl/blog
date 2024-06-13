import React from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="bg-gray-800 text-white flex justify-between items-center p-4">
      <div className="flex space-x-2">
        <Image src="/facebook.png" alt="facebook" width={24} height={24} />
        <Image src="/instagram.png" alt="instagram" width={24} height={24} />
        <Image src="/tiktok.png" alt="tiktok" width={24} height={24} />
        <Image src="/youtube.png" alt="youtube" width={24} height={24} />
      </div>
      <div className="text-3xl font-bold">Parathan blog</div>
      <div className="flex items-center space-x-4">
        <Link href="/" className="hover:text-gray-300">Homepage
        </Link>
        <Link href="/" className="hover:text-gray-300">Contact
        </Link>
        <Link href="/" className="hover:text-gray-300">About
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
