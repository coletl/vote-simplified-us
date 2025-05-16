
import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Layout from '@/components/layout/Layout';

// Mock data for US states
const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  // ... More states would go here
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" }
];

// Form schema
const addressFormSchema = z.object({
  street: z.string().min(2, { message: "Street address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zipCode: z.string().min(5, { message: "Valid ZIP code is required" }),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

const VoterInfo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationInfo, setRegistrationInfo] = useState<null | any>(null);
  const [activeTab, setActiveTab] = useState("address");
  const { toast } = useToast();

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const onSubmit = async (data: AddressFormValues) => {
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      // Mock response - in a real app, this would come from an API
      setRegistrationInfo({
        status: "ACTIVE",
        pollingLocation: {
          name: "Community Center",
          address: "123 Main St, Anytown, CA 94321",
          hours: "7:00 AM - 8:00 PM"
        },
        earlyVoting: {
          available: true,
          startDate: "October 15, 2024",
          endDate: "November 1, 2024",
          locations: [
            {
              name: "County Administration Building",
              address: "456 Government Blvd, Anytown, CA 94321",
              hours: "9:00 AM - 5:00 PM, Monday-Friday"
            }
          ]
        },
        mailBallot: {
          deadline: "October 25, 2024",
          dropOffLocations: [
            {
              name: "County Library",
              address: "789 Library Lane, Anytown, CA 94321"
            }
          ]
        },
        importantDates: [
          { name: "Registration Deadline", date: "October 10, 2024" },
          { name: "Early Voting Begins", date: "October 15, 2024" },
          { name: "Mail Ballot Request Deadline", date: "October 25, 2024" },
          { name: "Election Day", date: "November 5, 2024" }
        ]
      });
      
      setActiveTab("results");
      setIsLoading(false);
      
      toast({
        title: "Address information processed",
        description: "We've found your voter information.",
      });
    }, 1500);
  };

  return (
    <Layout>
      <div className="civic-container py-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3">Check Your Voter Information</h1>
            <p className="text-muted-foreground">
              Enter your residential address to check your registration status and find your polling place.
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="address">Address Information</TabsTrigger>
              <TabsTrigger value="results" disabled={!registrationInfo}>Voter Information</TabsTrigger>
            </TabsList>
            
            <TabsContent value="address">
              <Card>
                <CardHeader>
                  <CardTitle>Enter Your Residential Address</CardTitle>
                  <CardDescription>
                    This must be the address where you are registered to vote.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="Anytown" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="State" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {US_STATES.map((state) => (
                                      <SelectItem key={state.value} value={state.value}>
                                        {state.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="zipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ZIP Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="12345" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full bg-civic-skyblue hover:bg-civic-skyblue/90" disabled={isLoading}>
                        {isLoading ? "Looking Up Information..." : "Find My Voter Information"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="results">
              {registrationInfo && (
                <div className="space-y-6">
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        </div>
                        Registration Status: Active
                      </CardTitle>
                      <CardDescription>
                        You are registered to vote at your current address.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MapPin className="mr-2 h-5 w-5 text-civic-skyblue" />
                        Your Polling Location
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold">{registrationInfo.pollingLocation.name}</h4>
                        <p className="text-muted-foreground">{registrationInfo.pollingLocation.address}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Hours on Election Day:</h4>
                        <p className="text-muted-foreground">{registrationInfo.pollingLocation.hours}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="mr-2 h-5 w-5 text-civic-skyblue" />
                        Important Dates
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {registrationInfo.importantDates.map((date: any, index: number) => (
                          <div key={index} className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0">
                            <span className="font-medium">{date.name}</span>
                            <span className="text-muted-foreground">{date.date}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-base">
                          <Clock className="mr-2 h-5 w-5 text-civic-skyblue" />
                          Early Voting
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm">
                          <span className="font-semibold">Available:</span>{" "}
                          {registrationInfo.earlyVoting.startDate} - {registrationInfo.earlyVoting.endDate}
                        </p>
                        {registrationInfo.earlyVoting.locations.map((location: any, index: number) => (
                          <div key={index} className="text-sm">
                            <div className="font-semibold">{location.name}</div>
                            <div className="text-muted-foreground">{location.address}</div>
                            <div className="text-muted-foreground">{location.hours}</div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-base">
                          <Calendar className="mr-2 h-5 w-5 text-civic-skyblue" />
                          Vote by Mail
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm">
                          <span className="font-semibold">Request Deadline:</span>{" "}
                          {registrationInfo.mailBallot.deadline}
                        </p>
                        <div className="text-sm">
                          <div className="font-semibold">Ballot Drop-off Locations:</div>
                          {registrationInfo.mailBallot.dropOffLocations.map((location: any, index: number) => (
                            <div key={index} className="text-muted-foreground mt-1">
                              {location.name} - {location.address}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default VoterInfo;
