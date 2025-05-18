
import { toast } from "@/hooks/use-toast";

// API key for Google Civic Information API
const API_KEY = "AIzaSyAm-8D0SJm0veb5sblnu9Ec-LxjO4Xroj8";
const BASE_URL = "https://civicinfo.googleapis.com/civicinfo/v2";

// Interface for address input
export interface AddressInput {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

// Response types for Google Civic API
export interface ElectionInfo {
  id: string;
  name: string;
  electionDay: string;
  ocdDivisionId?: string;
}

export interface PollingLocation {
  address: {
    locationName?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  notes?: string;
  pollingHours?: string;
  name?: string;
  voterServices?: string;
  startDate?: string;
  endDate?: string;
  sources?: Array<{name: string, official: boolean}>;
}

export interface Contest {
  type: string;
  office?: string;
  primaryParty?: string;
  district?: {
    name: string;
    scope: string;
    id: string;
  };
  level?: string[];
  roles?: string[];
  candidates?: Array<{
    name: string;
    party?: string;
    candidateUrl?: string;
    phone?: string;
    email?: string;
    photoUrl?: string;
    channels?: Array<{type: string, id: string}>;
  }>;
  referendumTitle?: string;
  referendumSubtitle?: string;
  referendumUrl?: string;
  referendumBrief?: string;
  referendumText?: string;
  referendumProStatement?: string;
  referendumConStatement?: string;
  referendumPassageThreshold?: string;
  referendumEffectOfAbstain?: string;
  referendumBallotResponses?: string[];
  sources?: Array<{name: string, official: boolean}>;
}

export interface VoterInfoResponse {
  election: ElectionInfo;
  normalizedInput: {
    line1: string;
    city: string;
    state: string;
    zip: string;
  };
  pollingLocations?: PollingLocation[];
  earlyVoteSites?: PollingLocation[];
  dropOffLocations?: PollingLocation[];
  contests?: Contest[];
  state?: Array<{
    name: string;
    electionAdministrationBody?: {
      name: string;
      electionInfoUrl?: string;
      votingLocationFinderUrl?: string;
      ballotInfoUrl?: string;
      correspondenceAddress?: {
        line1: string;
        city: string;
        state: string;
        zip: string;
      };
    };
    sources?: Array<{name: string, official: boolean}>;
  }>;
}

export interface ElectionsListResponse {
  kind: string;
  elections: ElectionInfo[];
}

export interface Division {
  name: string;
  ocdId: string;
  scope?: string;
}

// Function to fetch all available elections
export const getElections = async (): Promise<ElectionInfo[]> => {
  try {
    const response = await fetch(`${BASE_URL}/elections?key=${API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch elections: ${response.status}`);
    }
    
    const data = await response.json() as ElectionsListResponse;
    return data.elections || [];
  } catch (error) {
    console.error("Error fetching elections:", error);
    toast({
      title: "Error",
      description: "Unable to fetch elections information",
      variant: "destructive"
    });
    return [];
  }
};

// Function to get voter information based on address and election ID
export const getVoterInfo = async (
  address: string,
  electionId?: string
): Promise<VoterInfoResponse | null> => {
  try {
    // URL encode the address
    const encodedAddress = encodeURIComponent(address);
    
    // Build the API URL - if electionId is not provided, API will return info for the next election
    let url = `${BASE_URL}/voterinfo?address=${encodedAddress}&key=${API_KEY}`;
    if (electionId) {
      url += `&electionId=${electionId}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      // Handle 400 errors which might occur if no election data is available
      if (response.status === 400) {
        console.warn("No voter information available for this address/election combination");
        return null;
      }
      throw new Error(`Failed to fetch voter info: ${response.status}`);
    }
    
    return await response.json() as VoterInfoResponse;
  } catch (error) {
    console.error("Error fetching voter information:", error);
    toast({
      title: "Error",
      description: "Unable to fetch voter information for this address",
      variant: "destructive"
    });
    return null;
  }
};

// Function to get representative information based on address (includes division information)
export const getRepresentativeInfo = async (address: string): Promise<any> => {
  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `${BASE_URL}/representatives?address=${encodedAddress}&key=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch representative info: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching representative information:", error);
    toast({
      title: "Error",
      description: "Unable to fetch district information for this address",
      variant: "destructive"
    });
    return null;
  }
};

// Utility function to format full address from components
export const formatAddress = (addressComponents: AddressInput): string => {
  const { street, city, state, zip } = addressComponents;
  let formattedAddress = "";
  
  if (street) formattedAddress += street;
  if (city) formattedAddress += (formattedAddress ? ", " : "") + city;
  if (state) formattedAddress += (formattedAddress ? ", " : "") + state;
  if (zip) formattedAddress += (formattedAddress ? " " : "") + zip;
  
  return formattedAddress;
};

// Extract relevant district information from divisions
export const extractDistrictInfo = (divisions: Record<string, any>): Record<string, string> => {
  const districts: Record<string, string> = {};
  
  // Process each division key
  Object.keys(divisions).forEach(ocdId => {
    // Handle country-level division
    if (ocdId.includes("country:us")) {
      districts.country = "United States";
    }
    
    // Handle state-level division
    const stateMatch = ocdId.match(/ocd-division\/country:us\/state:(\w+)/);
    if (stateMatch && !ocdId.includes("county") && !ocdId.includes("place")) {
      districts.state = divisions[ocdId].name || stateMatch[1].toUpperCase();
    }
    
    // Handle county-level division
    const countyMatch = ocdId.match(/ocd-division\/country:us\/state:\w+\/county:(\w+)/);
    if (countyMatch) {
      districts.county = divisions[ocdId].name || `${countyMatch[1]} County`;
    }
    
    // Handle city/place-level division
    const placeMatch = ocdId.match(/ocd-division\/country:us\/state:\w+\/place:(\w+)/);
    if (placeMatch) {
      districts.municipal = divisions[ocdId].name || placeMatch[1];
    }
    
    // Handle congressional district
    const cdMatch = ocdId.match(/ocd-division\/country:us\/state:\w+\/cd:(\d+)/);
    if (cdMatch) {
      districts.congressional_district = `Congressional District ${cdMatch[1]}`;
    }
    
    // Handle state senate district (upper chamber)
    const slduMatch = ocdId.match(/ocd-division\/country:us\/state:\w+\/sldu:(\d+)/);
    if (slduMatch) {
      districts.state_district = `State Senate District ${slduMatch[1]}`;
    }
    
    // Handle state house district (lower chamber)
    const sldlMatch = ocdId.match(/ocd-division\/country:us\/state:\w+\/sldl:(\d+)/);
    if (sldlMatch) {
      districts.state_lower_district = `State House District ${sldlMatch[1]}`;
    }
    
    // Handle school district
    const schoolMatch = ocdId.match(/ocd-division\/country:us\/state:\w+\/school_district:(\w+)/);
    if (schoolMatch) {
      districts.school_board = divisions[ocdId].name || `${schoolMatch[1]} School District`;
    }
  });
  
  return districts;
};
