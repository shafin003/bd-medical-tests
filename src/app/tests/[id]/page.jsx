"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle } from 'lucide-react';

export default function TestDetailPage() {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchTestDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/tests/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTest(data);
      } catch (err) {
        console.error("Error fetching test details:", err);
        setError("Failed to load test details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-10 w-3/4 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-48 w-full mt-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center text-red-500">
        <p>{error}</p>
        <Button className="mt-6" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Medical Test Not Found</h1>
        <p className="text-lg text-muted-foreground">The medical test you are looking for does not exist.</p>
        <Button className="mt-6" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-bold">{test.name}</h1>
        <Button onClick={() => router.push(`/compare?testId=${test.id}`)}>
          Compare Test
        </Button>
      </div>
      <p className="text-lg text-muted-foreground mb-6">Category: {test.test_categories?.name || 'N/A'}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Test Info Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Test Details</CardTitle>
            <CardDescription>Comprehensive information about {test.name}.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {test.description && (
              <div>
                <h3 className="text-lg font-semibold">Description:</h3>
                <p>{test.description}</p>
              </div>
            )}
            {test.purpose && (
              <div>
                <h3 className="text-lg font-semibold">Purpose:</h3>
                <p>{test.purpose}</p>
              </div>
            )}
            {test.preparation_instructions && (
              <div>
                <h3 className="text-lg font-semibold">Preparation Instructions:</h3>
                <p>{test.preparation_instructions}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><strong>Fasting Required:</strong> {test.fasting_required ? 'Yes' : 'No'}</p>
              <p><strong>Normal Range:</strong> {test.normal_range || 'N/A'}</p>
              <p><strong>Turnaround Time:</strong> {test.turnaround_time || 'N/A'}</p>
              <p><strong>Sample Type:</strong> {test.sample_type || 'N/A'}</p>
              <p><strong>Gender Specific:</strong> {test.gender_specific || 'Both'}</p>
              <p><strong>Age Restrictions:</strong> {test.age_restrictions || 'None'}</p>
            </div>
            {test.common_symptoms && test.common_symptoms.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold">Common Symptoms This Test Helps Diagnose:</h3>
                <div className="flex flex-wrap gap-2">
                  {test.common_symptoms.map((symptom, index) => (
                    <span key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Price Comparison Table */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Price Comparison</CardTitle>
            <CardDescription>Prices for {test.name} across different hospitals.</CardDescription>
          </CardHeader>
          <CardContent>
            {test.hospital_services && test.hospital_services.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Home Collection</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Time</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {test.hospital_services.map((service) => (
                      <tr key={service.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.hospitals.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">৳{service.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {service.home_collection_available ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.report_delivery_time || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground">No price information available for this test.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Related Tests / Hospital Suggestions (Placeholder) */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Related Information</CardTitle>
          <CardDescription>Explore related tests or hospitals offering similar services.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Placeholder for related tests or hospital suggestions.</p>
        </CardContent>
      </Card>
    </div>
  );
}
