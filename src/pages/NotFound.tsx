
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from '@/components/layout/Layout';

const NotFound = () => {
  const location = useLocation();

  return (
    <Layout>
      <div className="civic-container py-20">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-9xl font-bold text-civic-skyblue mb-4">404</h1>
          <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            We can't seem to find the page you're looking for. The page might have been moved, deleted, or never existed.
          </p>
          <div className="space-y-4">
            <Button asChild className="w-full bg-civic-skyblue hover:bg-civic-skyblue/90">
              <Link to="/">Return to Home</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/voter-info">Check Voter Information</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
