
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Vote } from "lucide-react";
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <Layout>
      <div className="civic-container py-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <Vote className="h-12 w-12 text-civic-skyblue mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-3">About CivicSimplified</h1>
            <p className="text-muted-foreground">
              Our mission is to make civic engagement accessible, straightforward, and meaningful for everyone.
            </p>
          </div>
          
          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="mb-4">
                CivicSimplified was created with a simple goal: to break down the barriers to democratic participation. 
                We believe that an informed and engaged citizenry is essential to a healthy democracy, but too often, 
                the process of voting and staying informed about elections can be unnecessarily complicated.
              </p>
              <p>
                Our platform aims to provide clear, accessible, and unbiased information about voting processes, 
                elections, candidates, and ballot measures. We're committed to helping every eligible voter exercise 
                their right to vote with confidence.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-civic-blue">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Voter Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Check your registration status, find your polling place, and get important election deadlines.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-civic-purple">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Election Tracking</h3>
                    <p className="text-sm text-muted-foreground">
                      Stay up-to-date on all upcoming elections at every level of government relevant to you.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-civic-lightgray">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Candidate Research</h3>
                    <p className="text-sm text-muted-foreground">
                      Access comprehensive, unbiased information about candidates and ballot measures.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Our Commitment to Neutrality</h2>
              <p className="mb-4">
                We are firmly committed to political neutrality. Our goal is to present information in a 
                factual, unbiased manner that allows you to make your own informed decisions. We do not 
                endorse candidates or take positions on ballot initiatives.
              </p>
              <p>
                All candidate and election information is sourced from reliable public data, primarily 
                from Ballotpedia, government election offices, and official campaign materials.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Data Sources & Privacy</h2>
              <p className="mb-4">
                We integrate with trusted data sources to provide accurate and up-to-date information about 
                elections, candidates, and voting procedures. This includes official government election 
                databases and Ballotpedia's comprehensive election data.
              </p>
              <p className="mb-4">
                We take your privacy seriously. Your personal information is only used to provide you with 
                relevant voter information and is never shared with third parties for commercial purposes.
              </p>
              <div className="flex justify-center mt-6">
                <Button asChild variant="outline">
                  <Link to="/privacy">View Our Privacy Policy</Link>
                </Button>
              </div>
            </section>
            
            <section className="bg-civic-blue rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Get Started Today</h2>
              <p className="mb-6 max-w-xl mx-auto">
                Ready to make your voice heard? Enter your address to check your voter registration status 
                and discover what's on your ballot in upcoming elections.
              </p>
              <Button asChild size="lg" className="bg-civic-skyblue hover:bg-civic-skyblue/90">
                <Link to="/voter-info">Find My Voter Information</Link>
              </Button>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
