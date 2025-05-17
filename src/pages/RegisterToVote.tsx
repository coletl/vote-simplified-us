
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
import { ExternalLink } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

// State voter registration information
const stateRegistrationInfo = {
  AL: {
    url: "https://www.sos.alabama.gov/alabama-votes/voter/register-to-vote",
    deadline: "Must be received 15 days before election day",
    absenteeDeadline: "Application must be received 5 days before election day",
    earlyVoting: "No early voting"
  },
  AK: {
    url: "https://voterregistration.alaska.gov/",
    deadline: "30 days before election day",
    absenteeDeadline: "Received 10 days before election day",
    earlyVoting: "15 days before election day through election day"
  },
  AZ: {
    url: "https://servicearizona.com/VoterRegistration/selectLanguage",
    deadline: "29 days before election day",
    absenteeDeadline: "Received 11 days before election day",
    earlyVoting: "Begins 27 days before election day"
  },
  AR: {
    url: "https://www.sos.arkansas.gov/elections/voter-information/",
    deadline: "30 days before election day",
    absenteeDeadline: "7 days before election day",
    earlyVoting: "Begins 15 days before election day"
  },
  CA: {
    url: "https://registertovote.ca.gov/",
    deadline: "15 days before election day (same-day registration available)",
    absenteeDeadline: "7 days before election day",
    earlyVoting: "Varies by county, typically 29 days before election day"
  },
  CO: {
    url: "https://www.sos.state.co.us/voter/pages/pub/home.xhtml",
    deadline: "8 days before election day (same-day registration available)",
    absenteeDeadline: "All registered voters receive mail ballots",
    earlyVoting: "Begins 15 days before election day"
  },
  CT: {
    url: "https://portal.ct.gov/SOTS/Election-Services/Voter-Information/Voter-Registration-Information",
    deadline: "7 days before election day (same-day registration available)",
    absenteeDeadline: "Application received day before election day",
    earlyVoting: "No early voting"
  },
  DE: {
    url: "https://elections.delaware.gov/voter/votereg.shtml",
    deadline: "Fourth Saturday before election day",
    absenteeDeadline: "Received by noon day before election day",
    earlyVoting: "10 days before election day"
  },
  DC: {
    url: "https://www.dcboe.org/voters/register-to-vote/register-update-voter-registration",
    deadline: "Same-day registration available",
    absenteeDeadline: "7 days before election day",
    earlyVoting: "Begins 13 days before election day"
  },
  FL: {
    url: "https://registertovoteflorida.gov/",
    deadline: "29 days before election day",
    absenteeDeadline: "Received 10 days before election day",
    earlyVoting: "10-19 days before election day"
  },
  GA: {
    url: "https://georgia.gov/register-vote",
    deadline: "29 days before election day",
    absenteeDeadline: "11 days before election day",
    earlyVoting: "Begins fourth Monday before election day"
  },
  HI: {
    url: "https://olvr.hawaii.gov/",
    deadline: "Same-day registration available",
    absenteeDeadline: "All registered voters receive mail ballots",
    earlyVoting: "Begins 10 days before election day"
  },
  ID: {
    url: "https://elections.sos.idaho.gov/ElectionLink/ElectionLink/ApplicationInstructions.aspx",
    deadline: "25 days before election day (same-day registration available)",
    absenteeDeadline: "11 days before election day",
    earlyVoting: "Varies by county, typically begins 2-3 weeks before election day"
  },
  IL: {
    url: "https://ova.elections.il.gov/",
    deadline: "28 days before election day (same-day registration available)",
    absenteeDeadline: "5 days before election day",
    earlyVoting: "Begins 40 days before election day"
  },
  IN: {
    url: "https://www.in.gov/sos/elections/voter-information/register-to-vote/",
    deadline: "29 days before election day",
    absenteeDeadline: "12 days before election day",
    earlyVoting: "28 days before election day"
  },
  IA: {
    url: "https://sos.iowa.gov/elections/voterinformation/voterregistration.html",
    deadline: "15 days before election day (same-day registration available)",
    absenteeDeadline: "15 days before election day",
    earlyVoting: "29 days before election day"
  },
  KS: {
    url: "https://www.kdor.ks.gov/Apps/VoterReg/Default.aspx",
    deadline: "21 days before election day",
    absenteeDeadline: "7 days before election day",
    earlyVoting: "Begins 20 days before election day"
  },
  KY: {
    url: "https://vrsws.sos.ky.gov/ovrweb/",
    deadline: "29 days before election day",
    absenteeDeadline: "7 days before election day",
    earlyVoting: "Thursday to Saturday before election day"
  },
  LA: {
    url: "https://www.sos.la.gov/ElectionsAndVoting/RegisterToVote/",
    deadline: "30 days before election day (online 20 days)",
    absenteeDeadline: "4 days before election day",
    earlyVoting: "14-7 days before election day"
  },
  ME: {
    url: "https://www.maine.gov/sos/cec/elec/voter-info/voterguide.html",
    deadline: "Same-day registration available",
    absenteeDeadline: "3 days before election day",
    earlyVoting: "30-45 days before election day"
  },
  MD: {
    url: "https://elections.maryland.gov/voter_registration/application.html",
    deadline: "21 days before election day (same-day registration available)",
    absenteeDeadline: "7 days before election day",
    earlyVoting: "8 days before election day"
  },
  MA: {
    url: "https://www.sec.state.ma.us/ovr/",
    deadline: "10 days before election day",
    absenteeDeadline: "Application received 4 days before election day",
    earlyVoting: "11 days before election day"
  },
  MI: {
    url: "https://mvic.sos.state.mi.us/RegisterVoter",
    deadline: "15 days before election day (same-day registration available)",
    absenteeDeadline: "Friday before election day",
    earlyVoting: "9 days before election day"
  },
  MN: {
    url: "https://mnvotes.sos.state.mn.us/VoterRegistration/VoterRegistrationMain.aspx",
    deadline: "21 days before election day (same-day registration available)",
    absenteeDeadline: "Day before election day",
    earlyVoting: "46 days before election day"
  },
  MS: {
    url: "https://www.sos.ms.gov/elections-voting/voter-registration-information",
    deadline: "30 days before election day",
    absenteeDeadline: "Varies",
    earlyVoting: "No early voting"
  },
  MO: {
    url: "https://www.sos.mo.gov/elections/govotemissouri/register",
    deadline: "Fourth Wednesday before election day",
    absenteeDeadline: "Second Wednesday before election day",
    earlyVoting: "Varies by election"
  },
  MT: {
    url: "https://sosmt.gov/elections/vote/",
    deadline: "30 days before election day (same-day registration available)",
    absenteeDeadline: "Day before election day",
    earlyVoting: "30 days before election day"
  },
  NE: {
    url: "https://www.nebraska.gov/apps-sos-voter-registration/",
    deadline: "11 days before election day",
    absenteeDeadline: "11 days before election day",
    earlyVoting: "30 days before election day"
  },
  NV: {
    url: "https://www.nvsos.gov/sosvoterservices/Registration/step1.aspx",
    deadline: "Fifth Tuesday before election day (same-day registration available)",
    absenteeDeadline: "All registered voters receive mail ballots",
    earlyVoting: "Third Saturday before election day"
  },
  NH: {
    url: "https://www.sos.nh.gov/elections/voters/register-vote",
    deadline: "Same-day registration available",
    absenteeDeadline: "Day before election day",
    earlyVoting: "No early voting"
  },
  NJ: {
    url: "https://voter.svrs.nj.gov/register",
    deadline: "21 days before election day",
    absenteeDeadline: "7 days before election day",
    earlyVoting: "10 days before election day"
  },
  NM: {
    url: "https://portal.sos.state.nm.us/OVR/WebPages/InstructionsStep1.aspx",
    deadline: "28 days before election day (same-day registration available)",
    absenteeDeadline: "Friday before election day",
    earlyVoting: "28 days before election day"
  },
  NY: {
    url: "https://dmv.ny.gov/more-info/electronic-voter-registration-application",
    deadline: "25 days before election day",
    absenteeDeadline: "15 days before election day",
    earlyVoting: "10 days before election day"
  },
  NC: {
    url: "https://www.ncsbe.gov/registering/how-register",
    deadline: "25 days before election day (same-day registration during early voting)",
    absenteeDeadline: "7 days before election day",
    earlyVoting: "19-3 days before election day"
  },
  ND: {
    url: "https://vip.sos.nd.gov/PortalList.aspx",
    deadline: "No voter registration required",
    absenteeDeadline: "Day before election day",
    earlyVoting: "15 days before election day"
  },
  OH: {
    url: "https://olvr.ohiosos.gov/",
    deadline: "30 days before election day",
    absenteeDeadline: "3 days before election day",
    earlyVoting: "28 days before election day"
  },
  OK: {
    url: "https://oklahoma.gov/elections/voter-registration/register-to-vote.html",
    deadline: "25 days before election day",
    absenteeDeadline: "Tuesday before election day",
    earlyVoting: "Wednesday before election day"
  },
  OR: {
    url: "https://secure.sos.state.or.us/orestar/vr/register.do",
    deadline: "21 days before election day",
    absenteeDeadline: "All registered voters receive mail ballots",
    earlyVoting: "All voting by mail"
  },
  PA: {
    url: "https://www.pavoterservices.pa.gov/Pages/VoterRegistrationApplication.aspx",
    deadline: "15 days before election day",
    absenteeDeadline: "7 days before election day",
    earlyVoting: "50 days before election day (mail-in voting)"
  },
  RI: {
    url: "https://vote.sos.ri.gov/Home/RegistertoVote",
    deadline: "30 days before election day",
    absenteeDeadline: "21 days before election day",
    earlyVoting: "20 days before election day"
  },
  SC: {
    url: "https://info.scvotes.sc.gov/eng/ovr/start.aspx",
    deadline: "30 days before election day",
    absenteeDeadline: "11 days before election day",
    earlyVoting: "Early voting begins two weeks before election day"
  },
  SD: {
    url: "https://sdsos.gov/elections-voting/voting/register-to-vote/default.aspx",
    deadline: "15 days before election day",
    absenteeDeadline: "Day before election day",
    earlyVoting: "46 days before election day"
  },
  TN: {
    url: "https://ovr.govote.tn.gov/",
    deadline: "30 days before election day",
    absenteeDeadline: "7 days before election day",
    earlyVoting: "20-5 days before election day"
  },
  TX: {
    url: "https://www.texas.gov/living-in-texas/texas-voter-registration/",
    deadline: "30 days before election day",
    absenteeDeadline: "11 days before election day",
    earlyVoting: "17-4 days before election day"
  },
  UT: {
    url: "https://secure.utah.gov/voterreg/index.html",
    deadline: "11 days before election day (same-day registration available)",
    absenteeDeadline: "All registered voters receive mail ballots",
    earlyVoting: "14 days before election day"
  },
  VT: {
    url: "https://olvr.vermont.gov/",
    deadline: "Same-day registration available",
    absenteeDeadline: "Day before election day",
    earlyVoting: "45 days before election day"
  },
  VA: {
    url: "https://www.elections.virginia.gov/registration/how-to-register/",
    deadline: "22 days before election day",
    absenteeDeadline: "11 days before election day",
    earlyVoting: "45 days before election day"
  },
  WA: {
    url: "https://voter.votewa.gov/WhereToVote.aspx",
    deadline: "8 days before election day (same-day registration available)",
    absenteeDeadline: "All registered voters receive mail ballots",
    earlyVoting: "All voting by mail"
  },
  WV: {
    url: "https://ovr.sos.wv.gov/Register/Landing",
    deadline: "21 days before election day",
    absenteeDeadline: "6 days before election day",
    earlyVoting: "13-3 days before election day"
  },
  WI: {
    url: "https://myvote.wi.gov/en-us/Register-To-Vote",
    deadline: "20 days before election day (same-day registration available)",
    absenteeDeadline: "Thursday before election day",
    earlyVoting: "Varies by municipality, typically 2 weeks before election day"
  },
  WY: {
    url: "https://sos.wyo.gov/Elections/State/RegisteringToVote.aspx",
    deadline: "14 days before election day (same-day registration available)",
    absenteeDeadline: "Day before election day",
    earlyVoting: "40 days before election day"
  },
  PR: {
    url: "https://ww2.ceepur.org/Home/Register",
    deadline: "50 days before election day",
    absenteeDeadline: "Varies",
    earlyVoting: "Varies"
  },
  GU: {
    url: "https://gec.guam.gov/register",
    deadline: "10 working days before election day",
    absenteeDeadline: "7 days before election day",
    earlyVoting: "Varies"
  },
  VI: {
    url: "https://www.vivote.gov/voters/register-to-vote/",
    deadline: "30 days before election day",
    absenteeDeadline: "Varies",
    earlyVoting: "Varies"
  },
  AS: {
    url: "https://aselectionoffice.gov/",
    deadline: "29 days before election day",
    absenteeDeadline: "Varies",
    earlyVoting: "Varies"
  },
  MP: {
    url: "https://www.votecnmi.gov.mp/",
    deadline: "60 days before election day",
    absenteeDeadline: "Varies",
    earlyVoting: "Varies"
  }
};

const RegisterToVote = () => {
  const [selectedState, setSelectedState] = useState("");

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

    const info = stateRegistrationInfo[selectedState as keyof typeof stateRegistrationInfo];
    if (info?.url) {
      window.open(info.url, "_blank", "noopener,noreferrer");
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
              <CardTitle className="text-2xl">Register to Vote</CardTitle>
              <CardDescription>
                Select your state to see voting deadlines and access the official registration site.
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

                {selectedState && (
                  <div className="mt-6 p-4 bg-slate-50 rounded-md">
                    <h3 className="font-semibold mb-2">Important Deadlines</h3>
                    <ul className="space-y-2 text-sm">
                      <li><span className="font-medium">Registration:</span> {stateRegistrationInfo[selectedState as keyof typeof stateRegistrationInfo]?.deadline}</li>
                      <li><span className="font-medium">Absentee Ballot:</span> {stateRegistrationInfo[selectedState as keyof typeof stateRegistrationInfo]?.absenteeDeadline}</li>
                      <li><span className="font-medium">Early Voting:</span> {stateRegistrationInfo[selectedState as keyof typeof stateRegistrationInfo]?.earlyVoting}</li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={goToStateWebsite} 
                className="w-full bg-civic-skyblue hover:bg-civic-skyblue/90"
                disabled={!selectedState}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Go to Official State Registration Site
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterToVote;
