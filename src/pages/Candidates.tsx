
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { Search, Users, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Layout from '@/components/layout/Layout';

// Mock candidate data
const CANDIDATES = [
  {
    id: "1",
    name: "Jane Smith",
    party: "Democratic",
    race: "Governor",
    incumbent: true,
    level: "state",
    imageUrl: "https://placehold.co/100?text=JS",
    bio: "Jane Smith is the current Governor seeking re-election. Prior to her election in 2020, she served as Lieutenant Governor and State Senator.",
    experience: [
      "Governor (2020-Present)",
      "Lieutenant Governor (2016-2020)",
      "State Senator (2012-2016)"
    ],
    endorsements: ["Teachers Association", "Nurses Union", "Environmental Action Group"]
  },
  {
    id: "2",
    name: "Michael Johnson",
    party: "Republican",
    race: "Governor",
    incumbent: false,
    level: "state",
    imageUrl: "https://placehold.co/100?text=MJ",
    bio: "Michael Johnson is a business leader and former State Representative running for Governor. He has focused on economic development and fiscal responsibility.",
    experience: [
      "CEO, Johnson Industries (2018-Present)",
      "State Representative (2014-2018)",
      "City Council Member (2010-2014)"
    ],
    endorsements: ["Chamber of Commerce", "Police Union", "Small Business Alliance"]
  },
  {
    id: "3",
    name: "Robert Chen",
    party: "Independent",
    race: "Governor",
    incumbent: false,
    level: "state",
    imageUrl: "https://placehold.co/100?text=RC",
    bio: "Robert Chen is an entrepreneur and community organizer running as an independent candidate for Governor. He focuses on innovation and governmental reform.",
    experience: [
      "Founder, Tech Solutions Inc. (2015-Present)",
      "Community Development Director (2012-2015)",
      "Policy Analyst (2008-2012)"
    ],
    endorsements: ["Independent Voters Association", "Reform Now Coalition", "Tech Industry Leaders"]
  },
  {
    id: "4",
    name: "Sarah Williams",
    party: "Democratic",
    race: "U.S. Senate",
    incumbent: true,
    level: "federal",
    imageUrl: "https://placehold.co/100?text=SW",
    bio: "Sarah Williams is the incumbent U.S. Senator seeking her second term. She has prioritized healthcare reform and infrastructure investment.",
    experience: [
      "U.S. Senator (2018-Present)",
      "State Attorney General (2014-2018)",
      "County Prosecutor (2010-2014)"
    ],
    endorsements: ["Labor Federation", "Healthcare Workers Union", "Women's Leadership Coalition"]
  },
  {
    id: "5",
    name: "David Garcia",
    party: "Republican",
    race: "U.S. Senate",
    incumbent: false,
    level: "federal",
    imageUrl: "https://placehold.co/100?text=DG",
    bio: "David Garcia is a former military officer and business executive challenging for the U.S. Senate seat. His campaign focuses on national security and economic growth.",
    experience: [
      "Executive VP, National Security Solutions (2016-Present)",
      "Colonel, U.S. Army (Retired 2016)",
      "Military Intelligence Officer (1996-2016)"
    ],
    endorsements: ["Veterans Coalition", "National Business Forum", "Security Policy Alliance"]
  },
  {
    id: "6",
    name: "Lisa Martinez",
    party: "Democratic",
    race: "Mayor",
    incumbent: false,
    level: "local",
    imageUrl: "https://placehold.co/100?text=LM",
    bio: "Lisa Martinez is a city council member and community advocate running for Mayor. She has championed affordable housing and public transportation initiatives.",
    experience: [
      "City Council Member (2018-Present)",
      "Planning Commission Chair (2015-2018)",
      "Neighborhood Association President (2012-2015)"
    ],
    endorsements: ["Transit Workers Union", "Affordable Housing Coalition", "Local Firefighters Association"]
  }
];

// Get unique races and parties for filters
const RACES = Array.from(new Set(CANDIDATES.map(c => c.race)));
const PARTIES = Array.from(new Set(CANDIDATES.map(c => c.party)));
const LEVELS = [
  { value: "all", label: "All Levels" },
  { value: "federal", label: "Federal" },
  { value: "state", label: "State" },
  { value: "local", label: "Local" }
];

const Candidates = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearchTerm = searchParams.get('search') || '';
  const initialRace = searchParams.get('race') || 'all';
  const initialParty = searchParams.get('party') || 'all';
  const initialLevel = searchParams.get('level') || 'all';
  
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedRace, setSelectedRace] = useState(initialRace);
  const [selectedParty, setSelectedParty] = useState(initialParty);
  const [selectedLevel, setSelectedLevel] = useState(initialLevel);
  
  // Update search params when filters change
  const updateFilters = (filters: Record<string, string>) => {
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        searchParams.set(key, value);
      } else {
        searchParams.delete(key);
      }
    });
    setSearchParams(searchParams);
  };
  
  // Filter candidates based on selected filters
  const filteredCandidates = CANDIDATES.filter(candidate => {
    const matchesSearch = searchTerm === '' || 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.bio.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesRace = selectedRace === 'all' || candidate.race === selectedRace;
    const matchesParty = selectedParty === 'all' || candidate.party === selectedParty;
    const matchesLevel = selectedLevel === 'all' || candidate.level === selectedLevel;
    
    return matchesSearch && matchesRace && matchesParty && matchesLevel;
  });

  return (
    <Layout>
      <div className="civic-container py-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3">Candidate Information</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Learn about candidates running for office in upcoming elections. Filter by race, party affiliation, or search by name.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search candidates..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    updateFilters({ search: e.target.value });
                  }}
                />
              </div>
              
              <div>
                <Select 
                  value={selectedRace} 
                  onValueChange={(value) => {
                    setSelectedRace(value);
                    updateFilters({ race: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select race" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Races</SelectItem>
                    {RACES.map(race => (
                      <SelectItem key={race} value={race}>{race}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select 
                  value={selectedParty} 
                  onValueChange={(value) => {
                    setSelectedParty(value);
                    updateFilters({ party: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select party" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Parties</SelectItem>
                    {PARTIES.map(party => (
                      <SelectItem key={party} value={party}>{party}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select 
                  value={selectedLevel} 
                  onValueChange={(value) => {
                    setSelectedLevel(value);
                    updateFilters({ level: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVELS.map(level => (
                      <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {filteredCandidates.length} {filteredCandidates.length === 1 ? 'candidate' : 'candidates'} found
              </p>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRace('all');
                  setSelectedParty('all');
                  setSelectedLevel('all');
                  setSearchParams({});
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate) => (
                <Card key={candidate.id} className="transition-all hover:shadow-md">
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16 border">
                        <img src={candidate.imageUrl} alt={candidate.name} />
                      </Avatar>
                      <div>
                        <CardTitle>{candidate.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {candidate.race} {candidate.incumbent && '(Incumbent)'}
                        </CardDescription>
                        <div className="flex gap-2 mt-2">
                          <Badge 
                            className={
                              candidate.party === "Democratic" 
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100" 
                                : candidate.party === "Republican" 
                                ? "bg-red-100 text-red-800 hover:bg-red-100" 
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                            }
                          >
                            {candidate.party}
                          </Badge>
                          <Badge variant="outline">
                            {candidate.level.charAt(0).toUpperCase() + candidate.level.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{candidate.bio}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Experience</h4>
                        <ul className="space-y-1">
                          {candidate.experience.map((exp, index) => (
                            <li key={index} className="text-sm text-muted-foreground">• {exp}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Key Endorsements</h4>
                        <ul className="space-y-1">
                          {candidate.endorsements.map((endorsement, index) => (
                            <li key={index} className="text-sm text-muted-foreground">• {endorsement}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <span className="flex justify-between items-center w-full">
                        View Full Profile 
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 border rounded-lg bg-muted/10">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Candidates Found</h3>
                <p className="text-muted-foreground">
                  No candidates match your current filters. Try adjusting your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Candidates;
