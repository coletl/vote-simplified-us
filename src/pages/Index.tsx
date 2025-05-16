
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Search, Vote } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-civic-lightgray py-16 md:py-24">
        <div className="civic-container">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Simplify Your Civic Engagement
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Your personalized guide to voting and civic participation. Stay informed about elections, candidates, and issues that matter to you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-civic-skyblue hover:bg-civic-skyblue/90 h-12 px-6 text-base">
                <Link to="/voter-info">Check Voter Registration</Link>
              </Button>
              <Button asChild variant="outline" className="h-12 px-6 text-base">
                <Link to="/elections">View Upcoming Elections</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-white">
        <div className="civic-container">
          <h2 className="text-3xl font-bold text-center mb-12">How We Help You Participate</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="civic-card flex flex-col items-center text-center p-8">
              <div className="bg-civic-blue rounded-full p-4 mb-4">
                <Vote className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Voter Registration</h3>
              <p className="text-muted-foreground">
                Check your registration status, find out how to register, and get important deadlines for your location.
              </p>
            </div>
            
            <div className="civic-card flex flex-col items-center text-center p-8">
              <div className="bg-civic-purple rounded-full p-4 mb-4">
                <Calendar className="h-8 w-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Election Information</h3>
              <p className="text-muted-foreground">
                View all upcoming elections that affect you, from local to national, with important dates and details.
              </p>
            </div>
            
            <div className="civic-card flex flex-col items-center text-center p-8">
              <div className="bg-civic-lightgray rounded-full p-4 mb-4">
                <Search className="h-8 w-8 text-civic-neutral" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Candidate Research</h3>
              <p className="text-muted-foreground">
                Learn about all candidates on your ballot with unbiased information, background details, and policy positions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-civic-blue py-16">
        <div className="civic-container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Enter your address to check your voter registration status and see what's on your ballot.
          </p>
          <Button asChild className="bg-civic-skyblue hover:bg-civic-skyblue/90 h-12 px-6 text-base">
            <Link to="/voter-info">Find My Voter Information</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
