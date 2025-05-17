
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DistrictData {
  state_district: string;
  congressional_district: string;
  county: string;
  municipal: string;
  school_board: string;
}

const DistrictInfo = ({ districts }: { districts: DistrictData }) => {
  const hasDistricts = Object.values(districts).some(district => !!district);
  
  if (!hasDistricts) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Electoral Districts</CardTitle>
        <CardDescription>
          These are the electoral districts where you can vote in upcoming elections.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {districts.congressional_district && (
            <li className="flex justify-between items-center">
              <span className="font-medium">Congressional District:</span>
              <Badge variant="outline" className="ml-2">
                {districts.congressional_district}
              </Badge>
            </li>
          )}
          
          {districts.state_district && (
            <li className="flex justify-between items-center">
              <span className="font-medium">State Legislative District:</span>
              <Badge variant="outline" className="ml-2">
                {districts.state_district}
              </Badge>
            </li>
          )}
          
          {districts.county && (
            <li className="flex justify-between items-center">
              <span className="font-medium">County:</span>
              <Badge variant="outline" className="ml-2">
                {districts.county}
              </Badge>
            </li>
          )}
          
          {districts.municipal && (
            <li className="flex justify-between items-center">
              <span className="font-medium">Municipal District:</span>
              <Badge variant="outline" className="ml-2">
                {districts.municipal}
              </Badge>
            </li>
          )}
          
          {districts.school_board && (
            <li className="flex justify-between items-center">
              <span className="font-medium">School District:</span>
              <Badge variant="outline" className="ml-2">
                {districts.school_board}
              </Badge>
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
};

export default DistrictInfo;
