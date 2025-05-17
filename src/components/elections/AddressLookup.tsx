
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddressFormData {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface DistrictData {
  state_district: string;
  congressional_district: string;
  county: string;
  municipal: string;
  school_board: string;
}

const AddressLookup = ({ onDistrictsFound }: { onDistrictsFound: (districts: DistrictData) => void }) => {
  const [formData, setFormData] = useState<AddressFormData>({
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
            const url = `https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${longitude}&y=${latitude}&benchmark=Public_AR_Current&vintage=Current_Current&format=json`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.result && data.result.geographies) {
              const geoData = data.result.geographies;
              
              // Extract district information
              const districts: DistrictData = {
                state_district: geoData['State Legislative Districts - Upper'] ? 
                  geoData['State Legislative Districts - Upper'][0].NAME : '',
                congressional_district: geoData['Congressional Districts'] ? 
                  geoData['Congressional Districts'][0].NAME : '',
                county: geoData['Counties'] ? 
                  geoData['Counties'][0].NAME : '',
                municipal: geoData['Places'] ? 
                  geoData['Places'][0].NAME : '',
                school_board: geoData['School Districts - Unified'] ? 
                  geoData['School Districts - Unified'][0].NAME : ''
              };
              
              // Store the district information
              await storeDistrictData(districts);
              
              // Notify parent component of the districts found
              onDistrictsFound(districts);
              
              toast({
                title: "Location Found",
                description: "We've identified your electoral districts based on your location.",
              });
            } else {
              throw new Error("No geographic data found");
            }
          } catch (error) {
            console.error("Error fetching geolocation data:", error);
            toast({
              title: "Error",
              description: "Unable to determine your electoral districts from your location.",
              variant: "destructive"
            });
          } finally {
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

  const handleAddressLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { street, city, state, zip } = formData;
      if (!street || !city || !state) {
        throw new Error("Please complete the address form");
      }
      
      // Format address for Census Geocoder
      const formattedAddress = `${street}, ${city}, ${state} ${zip}`;
      const encodedAddress = encodeURIComponent(formattedAddress);
      const url = `https://geocoding.geo.census.gov/geocoder/geographies/address?street=${encodedAddress}&benchmark=Public_AR_Current&vintage=Current_Current&format=json`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.result && data.result.addressMatches && data.result.addressMatches.length > 0) {
        const geoData = data.result.addressMatches[0].geographies;
        
        // Extract district information
        const districts: DistrictData = {
          state_district: geoData['State Legislative Districts - Upper'] ? 
            geoData['State Legislative Districts - Upper'][0].NAME : '',
          congressional_district: geoData['Congressional Districts'] ? 
            geoData['Congressional Districts'][0].NAME : '',
          county: geoData['Counties'] ? 
            geoData['Counties'][0].NAME : '',
          municipal: geoData['Places'] ? 
            geoData['Places'][0].NAME : '',
          school_board: geoData['School Districts - Unified'] ? 
            geoData['School Districts - Unified'][0].NAME : ''
        };
        
        // Store the district information
        await storeDistrictData(districts);
        
        // Notify parent component of the districts found
        onDistrictsFound(districts);
        
        toast({
          title: "Address Found",
          description: "We've identified your electoral districts based on your address.",
        });
      } else {
        throw new Error("Address not found or unable to determine electoral districts");
      }
    } catch (error) {
      console.error("Error during address lookup:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Unable to determine your electoral districts.",
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
