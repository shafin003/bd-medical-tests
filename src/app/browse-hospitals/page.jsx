"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function BrowseHospitalsPage() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('name_asc'); // Default sort by name ascending

  useEffect(() => {
    const fetchHospitals = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/hospitals');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setHospitals(data.hospitals || []);
      } catch (err) {
        console.error("Error fetching hospitals:", err);
        setError("Failed to load hospitals. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  const sortedHospitals = [...hospitals].sort((a, b) => {
    if (sort === 'name_asc') {
      return a.name.localeCompare(b.name);
    } else if (sort === 'name_desc') {
      return b.name.localeCompare(a.name);
    } else if (sort === 'rating_desc') {
      return b.rating - a.rating;
    } else if (sort === 'rating_asc') {
      return a.rating - b.rating;
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Browse Hospitals</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Hospitals</h1>

      <div className="flex justify-end mb-6">
        <Select onValueChange={setSort} value={sort}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name_asc">Name (A-Z)</SelectItem>
            <SelectItem value="name_desc">Name (Z-A)</SelectItem>
            <SelectItem value="rating_desc">Rating (High to Low)</SelectItem>
            <SelectItem value="rating_asc">Rating (Low to High)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sortedHospitals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedHospitals.map((hospital) => (
            <Card key={hospital.id}>
              <CardHeader>
                <CardTitle>{hospital.name}</CardTitle>
                <CardDescription>{hospital.full_address}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Rating: {hospital.rating} ({hospital.total_reviews} reviews)</p>
                <Link href={`/hospitals/${hospital.id}`} passHref>
                  <Button variant="link" className="mt-2 p-0" asChild>View Hospital</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No hospitals found.</p>
        </div>
      )}
    </div>
  );
}