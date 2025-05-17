
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CalendarCheck, ClipboardCheck, UserPlus } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-civic-lightgray py-16 md:py-24">
        <div className="civic-container">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Civic
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Your guide to voting and civic participation.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <Button asChild className="bg-civic-skyblue hover:bg-civic-skyblue/90 h-24 flex flex-col p-6">
                <Link to="/check-registration">
                  <ClipboardCheck className="h-10 w-10 mb-2" />
                  <span>Check Registration</span>
                </Link>
              </Button>
              <Button asChild className="bg-civic-purple hover:bg-civic-purple/90 h-24 flex flex-col p-6">
                <Link to="/register-to-vote">
                  <UserPlus className="h-10 w-10 mb-2" />
                  <span>Register to Vote</span>
                </Link>
              </Button>
              <Button asChild className="bg-civic-blue hover:bg-civic-blue/90 h-24 flex flex-col p-6">
                <Link to="/elections">
                  <CalendarCheck className="h-10 w-10 mb-2" />
                  <span>Upcoming Elections</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
