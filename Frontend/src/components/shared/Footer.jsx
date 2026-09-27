import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, BookOpen, Phone, FileText, Lock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 py-6 overflow-hidden m-0 p-0 box-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div>
            <div className="flex items-center mb-3">
              <BookOpen className="mr-2 text-white" />
              <h3 className="text-lg font-bold text-white">E-Library</h3>
            </div>
            <p className="text-sm mb-3">
              A digital repository offering books across various genres. Enjoy reading anytime, anywhere!
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
                <Twitter size={16} />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
                <Youtube size={16} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Browse Books</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Categories</a></li>
              <li><a href="#" className="hover:text-white transition-colors">My Library</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-3">Support & Help</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={14} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} />
                <span>support@elibrary.com</span>
              </li>
              <li className="flex items-center gap-2">
                <FileText size={14} />
                <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
              </li>
              <li className="flex items-center gap-2">
                <Lock size={14} />
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-3">Newsletter</h4>
            <p className="text-sm mb-2">Stay updated with our latest releases</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-3 py-1 text-sm bg-gray-800 border border-gray-700 rounded-l focus:outline-none focus:border-blue-500 flex-grow"
              />
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded-r"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <Separator className="my-4 bg-gray-800" />
        
        {/* Copyright Notice */}
        <div className="text-sm text-center text-gray-500">
          © 2025 E-Library. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;