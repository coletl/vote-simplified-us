
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Vote } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  // Check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="border-b border-border bg-white sticky top-0 z-10">
      <div className="civic-container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Vote className="h-6 w-6 text-civic-skyblue" />
          <Link to="/" className="font-bold text-xl">CivicSimple</Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${
              isActive('/') ? 'text-civic-skyblue' : 'hover:text-civic-skyblue'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/check-registration" 
            className={`text-sm font-medium transition-colors ${
              isActive('/check-registration') ? 'text-civic-skyblue' : 'hover:text-civic-skyblue'
            }`}
          >
            Check Registration
          </Link>
          <Link 
            to="/register-to-vote" 
            className={`text-sm font-medium transition-colors ${
              isActive('/register-to-vote') ? 'text-civic-skyblue' : 'hover:text-civic-skyblue'
            }`}
          >
            Register to Vote
          </Link>
          <Link 
            to="/elections" 
            className={`text-sm font-medium transition-colors ${
              isActive('/elections') ? 'text-civic-skyblue' : 'hover:text-civic-skyblue'
            }`}
          >
            Elections
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" className="hidden md:inline-flex">
            <Link to="/about">About</Link>
          </Button>
          <Button asChild className="bg-civic-skyblue hover:bg-civic-skyblue/90 text-white">
            <Link to="/check-registration">Check Registration</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
