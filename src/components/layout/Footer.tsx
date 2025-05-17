
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-white mt-auto">
      <div className="civic-container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">CivicSimple</h3>
            <p className="text-sm text-muted-foreground">Making democratic participation accessible and straightforward for everyone.</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Voters</h4>
            <ul className="space-y-2">
              <li><Link to="/voter-info" className="text-sm hover:text-civic-skyblue transition-colors">Registration Check</Link></li>
              <li><Link to="/elections" className="text-sm hover:text-civic-skyblue transition-colors">Upcoming Elections</Link></li>
              <li><Link to="/candidates" className="text-sm hover:text-civic-skyblue transition-colors">Candidate Information</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm hover:text-civic-skyblue transition-colors">About Us</Link></li>
              <li><Link to="/faq" className="text-sm hover:text-civic-skyblue transition-colors">FAQ</Link></li>
              <li><a href="https://www.ballotpedia.org" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-civic-skyblue transition-colors">Ballotpedia</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm hover:text-civic-skyblue transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm hover:text-civic-skyblue transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} CivicSimple. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-civic-skyblue transition-colors">Twitter</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-civic-skyblue transition-colors">Facebook</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-civic-skyblue transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
