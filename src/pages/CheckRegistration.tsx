import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ExternalLink, Calendar } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

// State registration verification websites
const stateRegistrationUrls = {
  AL: "https://myinfo.alabamavotes.gov/VoterView",
  AK: "https://myvoterinformation.alaska.gov/",
  AZ: "https://my.arizona.vote/PortalList.aspx",
  AR: "https://www.voterview.ar-nova.org/VoterView",
  CA: "https://voterstatus.sos.ca.gov",
  CO: "https://www.sos.state.co.us/voter/pages/pub/olvr/findVoterReg.xhtml",
  CT: "https://portaldir.ct.gov/sots/LookUp.aspx",
  DE: "https://ivote.de.gov/voterview",
  DC: "https://www.dcboe.org/Voters/Register-To-Vote/Check-Voter-Registration-Status",
  FL: "https://registration.elections.myflorida.com/CheckVoterStatus",
  GA: "https://mvp.sos.ga.gov/s/",
  HI: "https://olvr.hawaii.gov/",
  ID: "https://elections.sos.idaho.gov/ElectionLink/ElectionLink/VoterSearch.aspx",
  IL: "https://ova.elections.il.gov/RegistrationLookup.aspx",
  IN: "https://indianavoters.in.gov/",
  IA: "https://sos.iowa.gov/elections/voterreg/regtovote/search.aspx",
  KS: "https://myvoteinfo.voteks.org/voterview",
  KY: "https://vrsws.sos.ky.gov/vic/",
  LA: "https://voterportal.sos.la.gov/",
  ME: "https://www.maine.gov/sos/cec/elec/data/index.html",
  MD: "https://voterservices.elections.maryland.gov/VoterSearch",
  MA: "https://www.sec.state.ma.us/VoterRegistrationSearch/MyVoterRegStatus.aspx",
  MI: "https://mvic.sos.state.mi.us/",
  MN: "https://mnvotes.sos.state.mn.us/VoterStatus.aspx",
  MS: "https://www.msegov.com/sos/voter_registration/amiregistered/Search",
  MO: "https://voteroutreach.sos.mo.gov/portal/",
  MT: "https://app.mt.gov/voterinfo/",
  NE: "https://www.votercheck.necvr.ne.gov/",
  NV: "https://www.nvsos.gov/votersearch/",
  NH: "https://app.sos.nh.gov/voterinformation",
  NJ: "https://voter.svrs.nj.gov/registration-check",
  NM: "https://voterportal.servis.sos.state.nm.us/WhereToVote.aspx",
  NY: "https://voterlookup.elections.ny.gov/",
  NC: "https://vt.ncsbe.gov/RegLkup/",
  ND: "https://vip.sos.nd.gov/WhereToVote.aspx",
  OH: "https://voterlookup.ohiosos.gov/voterlookup.aspx",
  OK: "https://okvoterportal.okelections.us/",
  OR: "https://secure.sos.state.or.us/orestar/vr/showVoterSearch.do",
  PA: "https://www.pavoterservices.pa.gov/pages/voterregistrationstatus.aspx",
  RI: "https://vote.sos.ri.gov/Home/UpdateVoterRecord",
  SC: "https://info.scvotes.sc.gov/eng/voterinquiry/VoterInformationRequest.aspx",
  SD: "https://vip.sdsos.gov/VIPLogin.aspx",
  TN: "https://tnmap.tn.gov/voterlookup/",
  TX: "https://teamrv-mvp.sos.texas.gov/MVP/mvp.do",
  UT: "https://votesearch.utah.gov/voter-search/search/search-by-voter/voter-info",
  VT: "https://mvp.vermont.gov/",
  VA: "https://vote.elections.virginia.gov/VoterInformation",
  WA: "https://voter.votewa.gov/WhereToVote.aspx",
  WV: "https://ovr.sos.wv.gov/Register/Landing",
  WI: "https://myvote.wi.gov/en-us/My-Voter-Info",
  WY: "https://sos.wyo.gov/Elections/Docs/WYCountyClerks.pdf",
  // Territories
  PR: "https://consulta.ceepur.org/",
  GU: "https://gec.guam.gov/validate/",
  VI: "https://www.vivote.gov/voters/lookup/",
  AS: "https://aselectionoffice.gov/",
  MP: "https://www.votecnmi.gov.mp/"
};

// Registration deadlines by state (example data - would need to be updated with real data)
const stateDeadlines = {
  AL: { registration: "15 days before Election Day", early: "14 days before Election Day", absentee: "5 days before Election Day" },
  AK: { registration: "30 days before Election Day", early: "15 days before Election Day", absentee: "10 days before Election Day" },
  AZ: { registration: "29 days before Election Day", early: "27 days before Election Day", absentee: "11 days before Election Day" },
  // Add for all states...
  CA: { registration: "15 days before Election Day, or same-day registration available", early: "Varies by county", absentee: "7 days before Election Day" },
  // ... other states would be filled in with real data
};

// Calculate actual dates for the next election (example using 2024 general election)
const getElectionDates = (state: string) => {
  // Next major election: November 5, 2024 (General Election)
  const electionDate = new Date(2024, 10, 5); // November 5, 2024
  
  if (!state || !stateDeadlines[state as keyof typeof stateDeadlines]) {
    return null;
  }
  
  const deadlines = stateDeadlines[state as keyof typeof stateDeadlines];
  const dates: Record<string, string> = {};
  
  // Calculate registration deadline
  if (deadlines.registration.includes("days")) {
    const days = parseInt(deadlines.registration.match(/\d+/)?.[0] || "0");
    const regDeadline = new Date(electionDate);
    regDeadline.setDate(regDeadline.getDate() - days);
    dates.registration = regDeadline.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } else {
    dates.registration = deadlines.registration;
  }
  
  // Calculate early voting deadline
  if (deadlines.early.includes("days")) {
    const days = parseInt(deadlines.early.match(/\d+/)?.[0] || "0");
    const earlyDeadline = new Date(electionDate);
    earlyDeadline.setDate(earlyDeadline.getDate() - days);
    dates.early = earlyDeadline.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } else {
    dates.early = deadlines.early;
  }
  
  // Calculate absentee deadline
  if (deadlines.absentee.includes("days")) {
    const days = parseInt(deadlines.absentee.match(/\d+/)?.[0] || "0");
    const absenteeDeadline = new Date(electionDate);
    absenteeDeadline.setDate(absenteeDeadline.getDate() - days);
    dates.absentee = absenteeDeadline.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } else {
    dates.absentee = deadlines.absentee;
  }
  
  return dates;
};

const CheckRegistration = () => {
  const [selectedState, setSelectedState] = useState("");
  const deadlineDates = getElectionDates(selectedState);

  const handleStateSelect = (value: string) => {
    setSelectedState(value);
  };

  const goToStateWebsite = () => {
    if (!selectedState) {
      toast({
        title: "State Required",
        description: "Please select your state to continue.",
        variant: "destructive"
      });
      return;
    }

    const url = stateRegistrationUrls[selectedState as keyof typeof stateRegistrationUrls];
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      toast({
        title: "Error",
        description: "Unable to find registration website for the selected state.",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="civic-container py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Check Your Voter Registration</CardTitle>
              <CardDescription>
                We'll direct you to your state's official voter registration verification site.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="state-select" className="text-sm font-medium">
                    Select Your State or Territory
                  </label>
                  <Select onValueChange={handleStateSelect} value={selectedState}>
                    <SelectTrigger id="state-select">
                      <SelectValue placeholder="Select state..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AL">Alabama</SelectItem>
                      <SelectItem value="AK">Alaska</SelectItem>
                      <SelectItem value="AZ">Arizona</SelectItem>
                      <SelectItem value="AR">Arkansas</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="CO">Colorado</SelectItem>
                      <SelectItem value="CT">Connecticut</SelectItem>
                      <SelectItem value="DE">Delaware</SelectItem>
                      <SelectItem value="DC">District of Columbia</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="GA">Georgia</SelectItem>
                      <SelectItem value="HI">Hawaii</SelectItem>
                      <SelectItem value="ID">Idaho</SelectItem>
                      <SelectItem value="IL">Illinois</SelectItem>
                      <SelectItem value="IN">Indiana</SelectItem>
                      <SelectItem value="IA">Iowa</SelectItem>
                      <SelectItem value="KS">Kansas</SelectItem>
                      <SelectItem value="KY">Kentucky</SelectItem>
                      <SelectItem value="LA">Louisiana</SelectItem>
                      <SelectItem value="ME">Maine</SelectItem>
                      <SelectItem value="MD">Maryland</SelectItem>
                      <SelectItem value="MA">Massachusetts</SelectItem>
                      <SelectItem value="MI">Michigan</SelectItem>
                      <SelectItem value="MN">Minnesota</SelectItem>
                      <SelectItem value="MS">Mississippi</SelectItem>
                      <SelectItem value="MO">Missouri</SelectItem>
                      <SelectItem value="MT">Montana</SelectItem>
                      <SelectItem value="NE">Nebraska</SelectItem>
                      <SelectItem value="NV">Nevada</SelectItem>
                      <SelectItem value="NH">New Hampshire</SelectItem>
                      <SelectItem value="NJ">New Jersey</SelectItem>
                      <SelectItem value="NM">New Mexico</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="NC">North Carolina</SelectItem>
                      <SelectItem value="ND">North Dakota</SelectItem>
                      <SelectItem value="OH">Ohio</SelectItem>
                      <SelectItem value="OK">Oklahoma</SelectItem>
                      <SelectItem value="OR">Oregon</SelectItem>
                      <SelectItem value="PA">Pennsylvania</SelectItem>
                      <SelectItem value="RI">Rhode Island</SelectItem>
                      <SelectItem value="SC">South Carolina</SelectItem>
                      <SelectItem value="SD">South Dakota</SelectItem>
                      <SelectItem value="TN">Tennessee</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="UT">Utah</SelectItem>
                      <SelectItem value="VT">Vermont</SelectItem>
                      <SelectItem value="VA">Virginia</SelectItem>
                      <SelectItem value="WA">Washington</SelectItem>
                      <SelectItem value="WV">West Virginia</SelectItem>
                      <SelectItem value="WI">Wisconsin</SelectItem>
                      <SelectItem value="WY">Wyoming</SelectItem>
                      <SelectItem value="PR">Puerto Rico</SelectItem>
                      <SelectItem value="GU">Guam</SelectItem>
                      <SelectItem value="VI">U.S. Virgin Islands</SelectItem>
                      <SelectItem value="AS">American Samoa</SelectItem>
                      <SelectItem value="MP">Northern Mariana Islands</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedState && deadlineDates && (
                  <div className="mt-6 space-y-4">
                    <div className="bg-muted/30 p-4 rounded-md">
                      <h3 className="font-semibold flex items-center mb-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        Important Deadlines for {selectedState}
                      </h3>
                      <div className="text-sm space-y-2">
                        <p><span className="font-medium">Next General Election:</span> November 5, 2024</p>
                        <p><span className="font-medium">Registration Deadline:</span> {deadlineDates.registration}</p>
                        <p><span className="font-medium">Early Voting:</span> {deadlineDates.early}</p>
                        <p><span className="font-medium">Absentee Ballot Request:</span> {deadlineDates.absentee}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={goToStateWebsite} 
                className="w-full bg-civic-skyblue hover:bg-civic-skyblue/90 text-white"
                disabled={!selectedState}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Go to Official State Website
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CheckRegistration;
