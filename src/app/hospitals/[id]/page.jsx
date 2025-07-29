"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, Mail, Globe, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function HospitalDetailPage() {
  const { id } = useParams();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchHospitalDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/hospitals/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setHospital(data);
      } catch (err) {
        console.error("Error fetching hospital details:", err);
        setError("Failed to load hospital details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalDetails();
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

  if (!hospital) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Hospital Not Found</h1>
        <p className="text-lg text-muted-foreground">The hospital you are looking for does not exist.</p>
        <Button className="mt-6" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-bold">{hospital.name}</h1>
        <Button onClick={() => router.push(`/compare?hospitalIds=${hospital.id}`)}>
          Compare Hospital
        </Button>
      </div>
      <p className="text-lg text-muted-foreground mb-6">{hospital.full_address}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hospital Info Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>About {hospital.name}</CardTitle>
            <CardDescription>Comprehensive details about this hospital.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {hospital.description && <p>{hospital.description}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{hospital.city}, {hospital.area}, {hospital.division}</span>
              </div>
              {hospital.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>{hospital.phone}</span>
                </div>
              )}
              {hospital.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>{hospital.email}</span>
                </div>
              )}
              {hospital.website && (
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {hospital.website}
                  </a>
                </div>
              )}
              {hospital.established_year && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Established: {hospital.established_year}</span>
                </div>
              )}
              {hospital.total_beds && (
                <div className="flex items-center space-x-2">
                  <span>Total Beds: {hospital.total_beds}</span>
                </div>
              )}
            </div>

            {/* Facilities */}
            {hospital.facilities && hospital.facilities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Facilities:</h3>
                <div className="flex flex-wrap gap-2">
                  {hospital.facilities.map((facility, index) => (
                    <span key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Operating Hours */}
            {hospital.operating_hours && Object.keys(hospital.operating_hours).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Operating Hours:</h3>
                <ul className="list-disc list-inside">
                  {Object.entries(hospital.operating_hours).map(([day, hours]) => (
                    <li key={day}>{day}: {hours}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Other Booleans */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                {hospital.emergency_service ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                <span>Emergency Service</span>
              </div>
              <div className="flex items-center space-x-2">
                {hospital.home_collection ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                <span>Home Collection</span>
              </div>
              <div className="flex items-center space-x-2">
                {hospital.parking_available ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                <span>Parking Available</span>
              </div>
              <div className="flex items-center space-x-2">
                {hospital.wheelchair_accessible ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                <span>Wheelchair Accessible</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Placeholder / Image Gallery */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Location & Images</CardTitle>
          </CardHeader>
          <CardContent>
            {hospital.images && hospital.images.length > 0 ? (
              <img src={hospital.images[0]} alt={`${hospital.name} image`} className="w-full h-48 object-cover rounded-md mb-4" />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                No Image Available
              </div>
            )}
            <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
              Interactive Map Placeholder
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Tests Table */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Available Tests</CardTitle>
          <CardDescription>Tests offered by {hospital.name} with pricing.</CardDescription>
        </CardHeader>
        <CardContent>
          {hospital.services && hospital.services.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Home Collection</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Time</th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hospital.services.map((service) => (
                    <tr key={service.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.medical_tests.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.medical_tests.category?.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">৳{service.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.home_collection_available ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.report_delivery_time || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/tests/${service.medical_tests.id}`} passHref>
                          <Button variant="link" className="p-0">View Test</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">No tests available for this hospital.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
