import React, { ReactNode } from 'react';
import Navbar from "./components/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Parathan Thiyagalingam",
  description: "Documenting my dev & weekly notes updates!",
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="container">
          <div className="wrapper">
            <Navbar />
            {children}
            <Footer />          
          </div>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
