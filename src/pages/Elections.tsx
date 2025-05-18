
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, ChevronRight, Vote, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Layout from '@/components/layout/Layout';
import AddressLookup from '@/components/elections/AddressLookup';
import DistrictInfo from '@/components/elections/DistrictInfo';
import VoterInfoDisplay from '@/components/elections/VoterInfoDisplay';
import { supabase } from "@/integrations/supabase/client";
import { getElections, getVoterInfo, formatAddress } from "@/services/googleCivicService";

// Define district data type
interface DistrictData {
  state_district: string;
  congressional_district: string;
  county: string;
  municipal: string;
  school_board: string;
  state?: string;
  state_lower_district?: string;
}

const Elections = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [userDistricts, setUserDistricts] = useState<DistrictData | null>(null);
  const [showMyElections, setShowMyElections] = useState(false);
  const [loadingElections, setLoadingElections] = useState(false);
  const [elections, setElections] = useState<any[]>([]);
  const [selectedElection, setSelectedElection] = useState<string | null>(null);
  const [voterInfo, setVoterInfo] = useState<any | null>(null);
  const [loadingVoterInfo, setLoadingVoterInfo] = useState(false);
  
  // Fetch user districts on component mount
  useEffect(() => {
    const fetchUserDistricts = async () => {
      // First try to get from localStorage
      const localDistricts = localStorage.getItem('userDistricts');
      if (localDistricts) {
        setUserDistricts(JSON.parse(localDistricts));
        setShowMyElections(true); // Auto-enable "My Elections" filter when districts are available
      }
      
      // Then try to get from database if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase
          .from('user_districts')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
          
        if (data) {
          const districtData: DistrictData = {
            state_district: data.state_district || '',
            congressional_district: data.congressional_district || '',
            county: data.county || '',
            municipal: data.municipal || '',
            school_board: data.school_board || '',
            state: data.state || '',
            state_lower_district: data.state_lower_district || ''
          };
          
          setUserDistricts(districtData);
          setShowMyElections(true); // Auto-enable "My Elections" filter when districts are available
          
          // Update localStorage as well
          localStorage.setItem('userDistricts', JSON.stringify(districtData));
        }
      }
    };
    
    fetchUserDistricts();
  }, []);
  
  // Fetch available elections when component mounts
  useEffect(() => {
    const fetchElections = async () => {
      setLoadingElections(true);
      try {
        const electionsData = await getElections();
        setElections(electionsData);
      } catch (error) {
        console.error("Error fetching elections:", error);
      } finally {
        setLoadingElections(false);
      }
    };
    
    fetchElections();
  }, []);
  
  // Fetch voter info when an election is selected and user has districts
  useEffect(() => {
    if (selectedElection && userDistricts) {
      fetchVoterInfo(selectedElection);
    }
  }, [selectedElection, userDistricts]);
  
  const handleDistrictsFound = (districts: DistrictData) => {
    setUserDistricts(districts);
    setShowMyElections(true); // Automatically enable "My Elections" filter
    
    // If we have elections, try to get voter info for the next election
    if (elections.length > 0) {
      // Find the closest upcoming election
      const today = new Date();
      const upcomingElections = elections
        .filter(election => new Date(election.electionDay) >= today)
        .sort((a, b) => new Date(a.electionDay).getTime() - new Date(b.electionDay).getTime());
      
      if (upcomingElections.length > 0) {
        setSelectedElection(upcomingElections[0].id);
      }
    }
  };
  
  const fetchVoterInfo = async (electionId: string) => {
    if (!userDistricts) return;
    
    setLoadingVoterInfo(true);
    setVoterInfo(null);
    
    try {
      // Construct address from user districts
      let address = '';
      if (userDistricts.state) {
        // If we have detailed address components, use those
        if (userDistricts.municipal && userDistricts.state) {
          address = `${userDistricts.municipal}, ${userDistricts.state}`;
        } else if (userDistricts.county && userDistricts.state) {
          address = `${userDistricts.county}, ${userDistricts.state}`;
        } else {
          address = userDistricts.state;
        }
      }
      
      if (!address) {
        throw new Error("Insufficient address information");
      }
      
      const info = await getVoterInfo(address, electionId);
      setVoterInfo(info);
    } catch (error) {
      console.error("Error fetching voter info:", error);
      setVoterInfo(null);
    } finally {
      setLoadingVoterInfo(false);
    }
  };
  
  const filteredElections = elections.filter(election => {
    // Filter by search term
    const matchesSearch = searchTerm === "" || 
      election.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Sort elections by date (closest first)
  const sortedElections = [...filteredElections].sort((a, b) => {
    return new Date(a.electionDay).getTime() - new Date(b.electionDay).getTime();
  });

  return (
    <Layout>
      <div className="civic-container py-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3">Upcoming Elections</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              View all elections you can participate in, based on your location. Find information about polling locations, candidates, and ballot measures.
            </p>
          </div>
          
          {/* Address Lookup and District Info Section */}
          {!userDistricts ? (
            <div className="mb-10">
              <AddressLookup onDistrictsFound={handleDistrictsFound} />
            </div>
          ) : (
            <div className="mb-10 grid md:grid-cols-2 gap-6">
              <DistrictInfo districts={userDistricts} />
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Looking for Different Elections?</CardTitle>
                    <CardDescription>
                      Update your location to see elections in a different area.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => setUserDistricts(null)} 
                      variant="outline" 
                      className="w-full"
                    >
                      Enter a Different Address
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          {/* Search and Filter Section */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search elections..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              className="bg-white"
              onClick={() => {
                setSearchTerm("");
              }}
            >
              Clear
            </Button>
          </div>
          
          {/* Elections List */}
          {loadingElections ? (
            <div className="text-center py-12">
              <p>Loading elections...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedElections.length > 0 ? (
                <>
                  <h2 className="text-xl font-bold">All Available Elections</h2>
                  {sortedElections.map((election) => (
                    <Card key={election.id} className={`transition-all hover:shadow-md ${selectedElection === election.id ? 'border-civic-skyblue' : ''}`}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{election.name}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(election.electionDay).toLocaleDateString(undefined, { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardFooter>
                        <Button 
                          variant={selectedElection === election.id ? "default" : "outline"} 
                          className={`w-full ${selectedElection === election.id ? 'bg-civic-skyblue text-white' : ''}`}
                          onClick={() => setSelectedElection(election.id)}
                          disabled={!userDistricts}
                        >
                          {selectedElection === election.id ? 'Selected' : 'View Details'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </>
              ) : (
                <div className="text-center py-12 border rounded-lg bg-muted/10">
                  <Vote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Elections Found</h3>
                  <p className="text-muted-foreground">
                    No elections match your current filters. Try adjusting your search criteria.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Voter Information Section */}
          {selectedElection && userDistricts && (
            <div className="mt-12">
              <Separator className="mb-8" />
              <h2 className="text-2xl font-bold mb-6">Your Voter Information</h2>
              
              {loadingVoterInfo ? (
                <div className="text-center py-12">
                  <p>Loading voter information...</p>
                </div>
              ) : voterInfo ? (
                <VoterInfoDisplay voterInfo={voterInfo} />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No Detailed Information Available</CardTitle>
                    <CardDescription>
                      We couldn't find specific voter information for your address in this election.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      This could be because:
                    </p>
                    <ul className="list-disc ml-5 mt-2 text-muted-foreground space-y-1">
                      <li>The election may not be applicable to your location</li>
                      <li>Detailed information hasn't been published yet</li>
                      <li>Your address information may need to be more specific</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => setUserDistricts(null)} 
                      variant="outline" 
                      className="w-full"
                    >
                      Try a Different Address
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Elections;
