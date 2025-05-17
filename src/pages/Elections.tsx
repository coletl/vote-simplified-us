
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, ChevronRight, Vote, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from '@/components/layout/Layout';
import AddressLookup from '@/components/elections/AddressLookup';
import DistrictInfo from '@/components/elections/DistrictInfo';
import { supabase } from "@/integrations/supabase/client";

// Define race type to include optional isBallotMeasure property
interface Race {
  id: string;
  title: string;
  candidates: number;
  isBallotMeasure?: boolean;
}

// Define election type
interface Election {
  id: string;
  title: string;
  date: string;
  level: "federal" | "state" | "local";
  description: string;
  type: "general" | "primary" | "special";
  races: Race[];
  districts?: string[]; // Districts where this election applies
}

// Define district data type
interface DistrictData {
  state_district: string;
  congressional_district: string;
  county: string;
  municipal: string;
  school_board: string;
}

// Mock election data
const ELECTIONS: Election[] = [
  {
    id: "1",
    title: "Federal General Election",
    date: "November 5, 2024",
    level: "federal",
    description: "Presidential, Senate, and House of Representatives elections",
    type: "general",
    races: [
      { id: "101", title: "President of the United States", candidates: 2 },
      { id: "102", title: "U.S. Senate", candidates: 3 },
      { id: "103", title: "U.S. House of Representatives - District 12", candidates: 4 }
    ],
    districts: ["All"] // Federal elections apply to all districts
  },
  {
    id: "2",
    title: "State General Election",
    date: "November 5, 2024",
    level: "state",
    description: "State executive offices, legislative chambers, and judicial positions",
    type: "general",
    races: [
      { id: "201", title: "Governor", candidates: 4 },
      { id: "202", title: "State Senate - District 7", candidates: 2 },
      { id: "203", title: "State Assembly - District 15", candidates: 3 },
      { id: "204", title: "State Supreme Court - Position 3", candidates: 2 }
    ],
    districts: ["State Legislative District 7", "State Legislative District 15"] // State elections apply to specific state districts
  },
  {
    id: "3",
    title: "Local General Election",
    date: "November 5, 2024",
    level: "local",
    description: "County and municipal positions, school boards, and local ballot measures",
    type: "general",
    races: [
      { id: "301", title: "Mayor", candidates: 3 },
      { id: "302", title: "City Council - At Large", candidates: 5 },
      { id: "303", title: "County Commissioner - District 2", candidates: 2 },
      { id: "304", title: "School Board - Position 1", candidates: 4 }
    ],
    districts: ["King County", "Seattle", "Seattle School District"] // Local elections apply to specific local districts
  },
  {
    id: "4",
    title: "State Primary Election",
    date: "August 6, 2024",
    level: "state",
    description: "Primary elections for state offices",
    type: "primary",
    races: [
      { id: "401", title: "Governor - Primary", candidates: 6 },
      { id: "402", title: "State Senate - District 7 - Primary", candidates: 4 },
      { id: "403", title: "State Assembly - District 15 - Primary", candidates: 5 }
    ],
    districts: ["State Legislative District 7", "State Legislative District 15"]
  },
  {
    id: "5",
    title: "Special Bond Election",
    date: "September 17, 2024",
    level: "local",
    description: "Special election for local infrastructure bond measure",
    type: "special",
    races: [
      { id: "501", title: "Infrastructure Bond Measure B", candidates: 0, isBallotMeasure: true }
    ],
    districts: ["King County", "Seattle"]
  }
];

const getLevelColor = (level: string) => {
  switch (level) {
    case "federal": return "bg-civic-skyblue text-white";
    case "state": return "bg-civic-purple text-white";
    case "local": return "bg-civic-blue text-white";
    default: return "bg-civic-lightgray text-foreground";
  }
};

const Elections = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [userDistricts, setUserDistricts] = useState<DistrictData | null>(null);
  const [showMyElections, setShowMyElections] = useState(false);
  
  // Fetch user districts on component mount
  useEffect(() => {
    const fetchUserDistricts = async () => {
      // First try to get from localStorage
      const localDistricts = localStorage.getItem('userDistricts');
      if (localDistricts) {
        setUserDistricts(JSON.parse(localDistricts));
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
            school_board: data.school_board || ''
          };
          
          setUserDistricts(districtData);
          // Update localStorage as well
          localStorage.setItem('userDistricts', JSON.stringify(districtData));
        }
      }
    };
    
    fetchUserDistricts();
  }, []);
  
  const handleDistrictsFound = (districts: DistrictData) => {
    setUserDistricts(districts);
  };
  
  const isElectionInUserDistrict = (election: Election): boolean => {
    if (!userDistricts || !election.districts) return false;
    
    // Federal elections apply to everyone
    if (election.level === "federal") return true;
    
    // For state and local elections, check if any of the election's districts match user's districts
    const userDistrictValues = Object.values(userDistricts).filter(Boolean);
    return election.districts.some(district => 
      district === "All" || userDistrictValues.includes(district)
    );
  };
  
  const filteredElections = ELECTIONS.filter(election => {
    // Filter by search term
    const matchesSearch = searchTerm === "" || 
      election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      election.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by tab selection
    const matchesTab = activeTab === "all" || 
      (activeTab === "upcoming" && new Date(election.date) > new Date()) ||
      (activeTab === election.level) ||
      (activeTab === election.type);
    
    // Filter by user's districts if "My Elections" filter is active
    const matchesUserDistrict = !showMyElections || isElectionInUserDistrict(election);
    
    return matchesSearch && matchesTab && matchesUserDistrict;
  });

  // Sort elections by date (closest first)
  const sortedElections = [...filteredElections].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <Layout>
      <div className="civic-container py-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3">Upcoming Elections</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              View all elections you can participate in, based on your location. Click on any election to learn more about the contests and candidates.
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
            <div className="flex gap-2">
              <Button 
                variant={showMyElections ? "default" : "outline"} 
                className={showMyElections ? "bg-civic-skyblue text-white" : "bg-white"}
                onClick={() => setShowMyElections(!showMyElections)}
                disabled={!userDistricts}
              >
                <Filter className="h-4 w-4 mr-2" />
                My Elections
              </Button>
              <Button 
                variant="outline" 
                className="bg-white"
                onClick={() => {
                  setSearchTerm("");
                  setShowMyElections(false);
                }}
              >
                Clear
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-4 sm:grid-cols-7 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="federal">Federal</TabsTrigger>
              <TabsTrigger value="state">State</TabsTrigger>
              <TabsTrigger value="local">Local</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="primary">Primary</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="space-y-6">
            {sortedElections.length > 0 ? (
              sortedElections.map((election) => (
                <Card key={election.id} className="transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{election.title}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {election.date}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getLevelColor(election.level)}>
                          {election.level.charAt(0).toUpperCase() + election.level.slice(1)}
                        </Badge>
                        <Badge variant="outline">
                          {election.type.charAt(0).toUpperCase() + election.type.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{election.description}</p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Contested Races:</h4>
                      <ul className="space-y-1">
                        {election.races.slice(0, 3).map((race) => (
                          <li key={race.id} className="text-sm flex justify-between">
                            <span>{race.title}</span>
                            {race.isBallotMeasure ? (
                              <Badge variant="outline">Ballot Measure</Badge>
                            ) : (
                              <span className="text-muted-foreground">{race.candidates} candidates</span>
                            )}
                          </li>
                        ))}
                        {election.races.length > 3 && (
                          <li className="text-sm text-muted-foreground">
                            +{election.races.length - 3} more races
                          </li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/elections/${election.id}`} className="flex justify-between items-center">
                        <span>View Election Details</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
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
        </div>
      </div>
    </Layout>
  );
};

export default Elections;
