
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  formatAddress,
  getRepresentativeInfo,
  extractDistrictInfo,
  AddressInput
} from "@/services/googleCivicService";

interface DistrictData {
  state_district: string;
  congressional_district: string;
  county: string;
  municipal: string;
  school_board: string;
  state?: string;
  state_lower_district?: string;
}

interface AddressLookupProps {
  onDistrictsFound: (districts: DistrictData) => void;
}

const AddressLookup: React.FC<AddressLookupProps> = ({ onDistrictsFound }) => {
  const [formData, setFormData] = useState<AddressInput>({
    street: '',
    city: '',
    state: '',
    zip: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleGeolocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // First attempt using the Census API
            const censusUrl = `https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${longitude}&y=${latitude}&benchmark=Public_AR_Current&vintage=Current_Current&format=json`;
            
            const censusResponse = await fetch(censusUrl);
            const censusData = await censusResponse.json();
            
            if (censusData.result && censusData.result.geographies) {
              // Extract address from census data
              const addressComponents = extractAddressFromCensus(censusData);
              if (addressComponents) {
                // Now use this address with Google Civic API
                await lookupDistrictsWithCivicApi(formatAddress(addressComponents));
              } else {
                // Fallback to using coordinates directly with Google Civic API
                await lookupDistrictsWithCivicApi(`${latitude},${longitude}`);
              }
            } else {
              // Fallback to using coordinates directly
              await lookupDistrictsWithCivicApi(`${latitude},${longitude}`);
            }
          } catch (error) {
            console.error("Error fetching geolocation data:", error);
            toast({
              title: "Error",
              description: "Unable to determine your electoral districts from your location.",
              variant: "destructive"
            });
            setLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLoading(false);
          toast({
            title: "Location Access Denied",
            description: "Please allow location access or enter your address manually.",
            variant: "destructive"
          });
        }
      );
    } else {
      setLoading(false);
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation. Please enter your address manually.",
        variant: "destructive"
      });
    }
  };

  const extractAddressFromCensus = (data: any): AddressInput | null => {
    try {
      if (data.result && data.result.geographies) {
        const geoData = data.result.geographies;
        const stateData = geoData['States'] ? geoData['States'][0] : null;
        const countyData = geoData['Counties'] ? geoData['Counties'][0] : null;
        const placeData = geoData['Places'] ? geoData['Places'][0] : null;
        
        // Construct partial address from available data
        return {
          state: stateData ? stateData.STUSAB : '',
          city: placeData ? placeData.NAME : '',
          // We don't have street from census data
        };
      }
      return null;
    } catch (error) {
      console.error("Error extracting address from census data:", error);
      return null;
    }
  };

  const handleAddressLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { street, city, state, zip } = formData;
      if (!street || !city || !state) {
        throw new Error("Please complete the address form");
      }
      
      // Format address for Google Civic API
      const formattedAddress = formatAddress(formData);
      await lookupDistrictsWithCivicApi(formattedAddress);
      
    } catch (error) {
      console.error("Error during address lookup:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Unable to determine your electoral districts.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const lookupDistrictsWithCivicApi = async (address: string) => {
    try {
      // Use Google Civic API to get representative info (which includes divisions)
      const repInfo = await getRepresentativeInfo(address);
      
      if (repInfo && repInfo.divisions) {
        // Extract district information from the API response
        const districtInfo = extractDistrictInfo(repInfo.divisions);
        
        // Format district data
        const districts: DistrictData = {
          state_district: districtInfo.state_district || '',
          congressional_district: districtInfo.congressional_district || '',
          county: districtInfo.county || '',
          municipal: districtInfo.municipal || '',
          school_board: districtInfo.school_board || '',
          state: districtInfo.state || '',
          state_lower_district: districtInfo.state_lower_district || ''
        };
        
        // Store district information
        await storeDistrictData(districts);
        
        // Notify parent component
        onDistrictsFound(districts);
        
        toast({
          title: "Address Found",
          description: "We've identified your electoral districts based on your address.",
        });
      } else {
        throw new Error("Unable to determine electoral districts from this address");
      }
    } catch (error) {
      console.error("Error with Civic API lookup:", error);
      toast({
        title: "Error",
        description: "Unable to determine your electoral districts. Please check your address and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const storeDistrictData = async (districts: DistrictData) => {
    try {
      // Store in local storage first
      localStorage.setItem('userDistricts', JSON.stringify(districts));
      
      // If user is logged in, store in database
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Check if the user already has districts stored
        const { data: existingDistricts } = await supabase
          .from('user_districts')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (existingDistricts) {
          // Update existing districts
          await supabase
            .from('user_districts')
            .update(districts)
            .eq('user_id', session.user.id);
        } else {
          // Insert new districts
          await supabase
            .from('user_districts')
            .insert({
              user_id: session.user.id,
              ...districts
            });
        }
      }
    } catch (error) {
      console.error("Error storing district data:", error);
      // Still proceed even if database storage fails - we have local storage as backup
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Find Your Elections</CardTitle>
        <CardDescription>
          Enter your address or use your current location to find elections in your area.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddressLookup} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="street" className="text-sm font-medium">Street Address</label>
            <Input
              id="street"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              placeholder="123 Main St"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium">City</label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Anytown"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="state" className="text-sm font-medium">State</label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="CA"
                maxLength={2}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="zip" className="text-sm font-medium">ZIP Code</label>
            <Input
              id="zip"
              name="zip"
              value={formData.zip}
              onChange={handleInputChange}
              placeholder="12345"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-civic-skyblue hover:bg-civic-skyblue/90 text-white"
            disabled={loading}
          >
            <Search className="mr-2 h-4 w-4" />
            Find My Elections
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">- or -</p>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleGeolocation}
            className="w-full"
            disabled={loading}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Use My Current Location
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressLookup;
