"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { XCircle } from 'lucide-react';

export default function ComparePage() {
  const [hospitalIds, setHospitalIds] = useState([]);
  const [testId, setTestId] = useState('');
  const [comparisonResults, setComparisonResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dummy data for hospital and test selection (replace with API calls later)
  const [availableHospitals, setAvailableHospitals] = useState([]);
  const [availableTests, setAvailableTests] = useState([]);

  useEffect(() => {
    // Fetch a list of hospitals for selection
    const fetchHospitals = async () => {
      try {
        const response = await fetch('/api/hospitals'); // Assuming an API to get all hospitals
        const data = await response.json();
        setAvailableHospitals(data.hospitals || []);
      } catch (err) {
        console.error("Error fetching available hospitals:", err);
      }
    };

    // Fetch a list of tests for selection
    const fetchTests = async () => {
      try {
        const response = await fetch('/api/tests'); // Assuming an API to get all tests
        const data = await response.json();
        setAvailableTests(data.tests || []);
      } catch (err) {
        console.error("Error fetching available tests:", err);
      }
    };

    fetchHospitals();
    fetchTests();
  }, []);

  const handleAddHospital = (id) => {
    if (id && !hospitalIds.includes(id) && hospitalIds.length < 4) {
      setHospitalIds([...hospitalIds, id]);
    }
  };

  const handleRemoveHospital = (id) => {
    setHospitalIds(hospitalIds.filter((hId) => hId !== id));
  };

  const handleCompare = async () => {
    setLoading(true);
    setError(null);
    setComparisonResults(null);

    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hospitalIds, testId: testId || undefined }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setComparisonResults(data);
    } catch (err) {
      console.error("Error during comparison:", err);
      setError("Failed to fetch comparison data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Compare Hospitals & Tests</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Select Items for Comparison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hospital Selection */}
          <div>
            <Label htmlFor="hospital-select" className="mb-2 block">Select Hospitals (Max 4):</Label>
            <div className="flex space-x-2">
              <Select onValueChange={handleAddHospital} value="">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Add Hospital" />
                </SelectTrigger>
                <SelectContent>
                  {availableHospitals.map((hospital) => (
                    <SelectItem key={hospital.id} value={hospital.id}>
                      {hospital.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {hospitalIds.map((id) => {
                const hospital = availableHospitals.find(h => h.id === id);
                return hospital ? (
                  <Button key={id} variant="outline" onClick={() => handleRemoveHospital(id)}>
                    {hospital.name} <XCircle className="ml-2 h-4 w-4" />
                  </Button>
                ) : null;
              })}
            </div>
          </div>

          {/* Test Selection */}
          <div>
            <Label htmlFor="test-select" className="mb-2 block">Select a Specific Test (Optional):</Label>
            <Select onValueChange={setTestId} value={testId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Test" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">-- No Specific Test --</SelectItem>
                {availableTests.map((test) => (
                  <SelectItem key={test.id} value={test.id}>
                    {test.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleCompare} disabled={hospitalIds.length === 0 || loading} className="w-full">
            {loading ? "Comparing..." : "Compare Selected Items"}
          </Button>
        </CardContent>
      </Card>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {comparisonResults && comparisonResults.hospitals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Comparison Results</CardTitle>
          </CardHeader>
          <CardContent>
            {comparisonResults.testComparison ? (
              // Test-specific comparison table
              <div className="overflow-x-auto">
                <h3 className="text-2xl font-semibold mb-4">{comparisonResults.testComparison.test.name} Price Comparison</h3>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discounted Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Home Collection Fee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Delivery Time</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {comparisonResults.testComparison.prices.map((priceInfo) => (
                      <tr key={priceInfo.hospitalId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{priceInfo.hospitalName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">৳{priceInfo.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {priceInfo.discountedPrice ? `৳${priceInfo.discountedPrice}` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">৳{priceInfo.homeCollectionFee}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{priceInfo.deliveryTime || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              // General hospital comparison (if no specific test selected)
              <div className="overflow-x-auto">
                <h3 className="text-2xl font-semibold mb-4">Hospital General Comparison</h3>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                      {comparisonResults.hospitals.map((hospital) => (
                        <th key={hospital.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{hospital.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Rating</td>
                      {comparisonResults.hospitals.map((hospital) => (
                        <td key={hospital.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hospital.rating} ({hospital.total_reviews} reviews)</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Address</td>
                      {comparisonResults.hospitals.map((hospital) => (
                        <td key={hospital.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hospital.full_address}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Phone</td>
                      {comparisonResults.hospitals.map((hospital) => (
                        <td key={hospital.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hospital.phone || 'N/A'}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Home Collection</td>
                      {comparisonResults.hospitals.map((hospital) => (
                        <td key={hospital.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {hospital.home_collection ? 'Yes' : 'No'}
                        </td>
                      ))}
                    </tr>
                    {/* Add more general comparison features as needed */}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
