
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { VoterInfoResponse, Contest, PollingLocation } from '@/services/googleCivicService';
import { AlertCircle, MapPin, Clock, Info } from 'lucide-react';

interface VoterInfoDisplayProps {
  voterInfo: VoterInfoResponse;
}

const VoterInfoDisplay: React.FC<VoterInfoDisplayProps> = ({ voterInfo }) => {
  if (!voterInfo) return null;
  
  // Format date for better display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format address for display
  const formatLocationAddress = (location: PollingLocation) => {
    const { address } = location;
    let formattedAddress = "";
    
    if (address.locationName) formattedAddress += `${address.locationName}\n`;
    if (address.line1) formattedAddress += `${address.line1}\n`;
    if (address.line2) formattedAddress += `${address.line2}\n`;
    if (address.city) formattedAddress += `${address.city}, `;
    if (address.state) formattedAddress += `${address.state} `;
    if (address.zip) formattedAddress += address.zip;
    
    return formattedAddress;
  };
  
  // Determine contest type label
  const getContestTypeLabel = (contest: Contest) => {
    if (contest.type === 'Referendum') {
      return 'Ballot Measure';
    }
    
    if (contest.level?.includes('country')) {
      return 'Federal';
    } else if (contest.level?.includes('administrativeArea1')) {
      return 'State';
    } else if (contest.level?.includes('administrativeArea2')) {
      return 'County';
    } else if (contest.level?.includes('locality')) {
      return 'Local';
    }
    
    return contest.type;
  };
  
  // Get color based on contest level
  const getContestColor = (contest: Contest) => {
    if (contest.type === 'Referendum') {
      return "bg-civic-purple text-white";
    }
    
    if (contest.level?.includes('country')) {
      return "bg-civic-skyblue text-white";
    } else if (contest.level?.includes('administrativeArea1')) {
      return "bg-civic-purple text-white";
    } else if (
      contest.level?.includes('administrativeArea2') || 
      contest.level?.includes('locality')
    ) {
      return "bg-civic-blue text-white";
    }
    
    return "bg-gray-500 text-white";
  };
  
  return (
    <div className="space-y-6">
      {/* Election Information */}
      <Card>
        <CardHeader>
          <CardTitle>{voterInfo.election.name}</CardTitle>
          <CardDescription>
            Election Day: {formatDate(voterInfo.election.electionDay)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {voterInfo.state && voterInfo.state[0]?.electionAdministrationBody && (
            <div className="space-y-2">
              <h3 className="font-medium">Election Administration</h3>
              <p>{voterInfo.state[0].electionAdministrationBody.name}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {voterInfo.state[0].electionAdministrationBody.electionInfoUrl && (
                  <a 
                    href={voterInfo.state[0].electionAdministrationBody.electionInfoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-civic-skyblue hover:underline"
                  >
                    Election Information
                  </a>
                )}
                {voterInfo.state[0].electionAdministrationBody.votingLocationFinderUrl && (
                  <a 
                    href={voterInfo.state[0].electionAdministrationBody.votingLocationFinderUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-civic-skyblue hover:underline"
                  >
                    Find Voting Locations
                  </a>
                )}
                {voterInfo.state[0].electionAdministrationBody.ballotInfoUrl && (
                  <a 
                    href={voterInfo.state[0].electionAdministrationBody.ballotInfoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-civic-skyblue hover:underline"
                  >
                    Ballot Information
                  </a>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Voting Locations */}
      <Tabs defaultValue="polling">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="polling">Polling Locations</TabsTrigger>
          <TabsTrigger value="early">Early Voting</TabsTrigger>
          <TabsTrigger value="dropoff">Drop-off Locations</TabsTrigger>
        </TabsList>
        
        {/* Polling Locations */}
        <TabsContent value="polling">
          {voterInfo.pollingLocations && voterInfo.pollingLocations.length > 0 ? (
            <div className="space-y-4">
              {voterInfo.pollingLocations.map((location, index) => (
                <Card key={`polling-${index}`}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {location.name || "Polling Location"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-civic-skyblue flex-shrink-0 mt-0.5" />
                        <div className="whitespace-pre-line">
                          {formatLocationAddress(location)}
                        </div>
                      </div>
                      
                      {location.pollingHours && (
                        <div className="flex items-start gap-2">
                          <Clock className="h-5 w-5 text-civic-skyblue flex-shrink-0 mt-0.5" />
                          <div className="whitespace-pre-line">
                            {location.pollingHours}
                          </div>
                        </div>
                      )}
                      
                      {location.notes && (
                        <div className="flex items-start gap-2">
                          <Info className="h-5 w-5 text-civic-skyblue flex-shrink-0 mt-0.5" />
                          <div className="whitespace-pre-line">
                            {location.notes}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No polling locations available</AlertTitle>
              <AlertDescription>
                Polling location information may not be available yet for this election. 
                Check back closer to election day or contact your local election office.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        {/* Early Voting Locations */}
        <TabsContent value="early">
          {voterInfo.earlyVoteSites && voterInfo.earlyVoteSites.length > 0 ? (
            <div className="space-y-4">
              {voterInfo.earlyVoteSites.map((location, index) => (
                <Card key={`early-${index}`}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {location.name || "Early Voting Site"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-civic-purple flex-shrink-0 mt-0.5" />
                        <div className="whitespace-pre-line">
                          {formatLocationAddress(location)}
                        </div>
                      </div>
                      
                      {location.pollingHours && (
                        <div className="flex items-start gap-2">
                          <Clock className="h-5 w-5 text-civic-purple flex-shrink-0 mt-0.5" />
                          <div className="whitespace-pre-line">
                            {location.pollingHours}
                          </div>
                        </div>
                      )}
                      
                      {(location.startDate || location.endDate) && (
                        <div className="flex items-start gap-2">
                          <Info className="h-5 w-5 text-civic-purple flex-shrink-0 mt-0.5" />
                          <div>
                            {location.startDate && (
                              <div>Starts: {formatDate(location.startDate)}</div>
                            )}
                            {location.endDate && (
                              <div>Ends: {formatDate(location.endDate)}</div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {location.notes && (
                        <div className="flex items-start gap-2">
                          <Info className="h-5 w-5 text-civic-purple flex-shrink-0 mt-0.5" />
                          <div className="whitespace-pre-line">
                            {location.notes}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No early voting locations available</AlertTitle>
              <AlertDescription>
                Early voting may not be available for this election or information hasn't been released yet.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        {/* Drop-off Locations */}
        <TabsContent value="dropoff">
          {voterInfo.dropOffLocations && voterInfo.dropOffLocations.length > 0 ? (
            <div className="space-y-4">
              {voterInfo.dropOffLocations.map((location, index) => (
                <Card key={`dropoff-${index}`}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {location.name || "Ballot Drop-off Location"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-civic-blue flex-shrink-0 mt-0.5" />
                        <div className="whitespace-pre-line">
                          {formatLocationAddress(location)}
                        </div>
                      </div>
                      
                      {location.pollingHours && (
                        <div className="flex items-start gap-2">
                          <Clock className="h-5 w-5 text-civic-blue flex-shrink-0 mt-0.5" />
                          <div className="whitespace-pre-line">
                            {location.pollingHours}
                          </div>
                        </div>
                      )}
                      
                      {location.notes && (
                        <div className="flex items-start gap-2">
                          <Info className="h-5 w-5 text-civic-blue flex-shrink-0 mt-0.5" />
                          <div className="whitespace-pre-line">
                            {location.notes}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No drop-off locations available</AlertTitle>
              <AlertDescription>
                Ballot drop-off location information may not be available yet for this election 
                or may not be applicable in your area.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Contests/Races Information */}
      {voterInfo.contests && voterInfo.contests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Contests on Your Ballot</h2>
          
          {voterInfo.contests.map((contest, index) => (
            <Card key={`contest-${index}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>
                      {contest.type === 'Referendum' 
                        ? contest.referendumTitle || 'Ballot Measure' 
                        : contest.office || 'Contest'}
                    </CardTitle>
                    {contest.district && (
                      <CardDescription>
                        {contest.district.name}
                      </CardDescription>
                    )}
                  </div>
                  <Badge className={getContestColor(contest)}>
                    {getContestTypeLabel(contest)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Candidate Contest */}
                {contest.type !== 'Referendum' && contest.candidates && (
                  <div className="space-y-3">
                    <h3 className="font-medium">Candidates</h3>
                    <div className="space-y-3">
                      {contest.candidates.map((candidate, idx) => (
                        <div key={`candidate-${idx}`} className="flex justify-between items-center py-2 border-b last:border-b-0">
                          <div>
                            <div className="font-medium">{candidate.name}</div>
                            {candidate.party && (
                              <div className="text-sm text-muted-foreground">
                                {candidate.party}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {candidate.candidateUrl && (
                              <a 
                                href={candidate.candidateUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-civic-skyblue hover:underline"
                              >
                                Website
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Referendum/Ballot Measure */}
                {contest.type === 'Referendum' && (
                  <div className="space-y-3">
                    {contest.referendumSubtitle && (
                      <div className="font-medium">{contest.referendumSubtitle}</div>
                    )}
                    
                    {contest.referendumBrief && (
                      <div className="text-sm">
                        <span className="font-medium">Brief: </span>
                        {contest.referendumBrief}
                      </div>
                    )}
                    
                    {contest.referendumText && (
                      <div className="text-sm mt-3 p-3 bg-muted rounded-md">
                        {contest.referendumText}
                      </div>
                    )}
                    
                    {(contest.referendumProStatement || contest.referendumConStatement) && (
                      <div className="grid md:grid-cols-2 gap-4 mt-3">
                        {contest.referendumProStatement && (
                          <div className="p-3 bg-green-50 rounded-md">
                            <div className="font-medium text-green-700 mb-1">Support Statement</div>
                            <div className="text-sm">{contest.referendumProStatement}</div>
                          </div>
                        )}
                        
                        {contest.referendumConStatement && (
                          <div className="p-3 bg-red-50 rounded-md">
                            <div className="font-medium text-red-700 mb-1">Opposition Statement</div>
                            <div className="text-sm">{contest.referendumConStatement}</div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {contest.referendumUrl && (
                      <div className="mt-3">
                        <a 
                          href={contest.referendumUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-civic-skyblue hover:underline"
                        >
                          More Information
                        </a>
                      </div>
                    )}
                    
                    {contest.referendumBallotResponses && contest.referendumBallotResponses.length > 0 && (
                      <div className="mt-3">
                        <div className="font-medium">Ballot Options:</div>
                        <ul className="list-disc pl-5 mt-1">
                          {contest.referendumBallotResponses.map((response, idx) => (
                            <li key={idx} className="text-sm">{response}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VoterInfoDisplay;
