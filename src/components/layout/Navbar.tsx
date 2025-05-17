
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Vote } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="border-b border-border bg-white sticky top-0 z-10">
      <div className="civic-container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Vote className="h-6 w-6 text-civic-skyblue" />
          <Link to="/" className="font-bold text-xl">CivicSimple</Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-civic-skyblue transition-colors">Home</Link>
          <Link to="/check-registration" className="text-sm font-medium hover:text-civic-skyblue transition-colors">Check Registration</Link>
          <Link to="/register-to-vote" className="text-sm font-medium hover:text-civic-skyblue transition-colors">Register to Vote</Link>
          <Link to="/elections" className="text-sm font-medium hover:text-civic-skyblue transition-colors">Elections</Link>
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
