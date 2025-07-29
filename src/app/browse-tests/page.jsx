"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function BrowseTestsPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('name_asc'); // Default sort by name ascending

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/tests');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTests(data.tests || []);
      } catch (err) {
        console.error("Error fetching tests:", err);
        setError("Failed to load tests. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const sortedTests = [...tests].sort((a, b) => {
    if (sort === 'name_asc') {
      return a.name.localeCompare(b.name);
    } else if (sort === 'name_desc') {
      return b.name.localeCompare(a.name);
    } else if (sort === 'price_asc') {
      // Assuming tests fetched from /api/tests will eventually have lowestPrice
      // For now, use a placeholder or handle undefined
      const priceA = a.lowestPrice || Infinity;
      const priceB = b.lowestPrice || Infinity;
      return priceA - priceB;
    } else if (sort === 'price_desc') {
      const priceA = a.lowestPrice || -Infinity;
      const priceB = b.lowestPrice || -Infinity;
      return priceB - priceA;
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Browse Medical Tests</h1>
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
      <h1 className="text-3xl font-bold mb-6">Browse Medical Tests</h1>

      <div className="flex justify-end mb-6">
        <Select onValueChange={setSort} value={sort}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name_asc">Name (A-Z)</SelectItem>
            <SelectItem value="name_desc">Name (Z-A)</SelectItem>
            <SelectItem value="price_asc">Price (Low to High)</SelectItem>
            <SelectItem value="price_desc">Price (High to Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sortedTests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedTests.map((test) => (
            <Card key={test.id}>
              <CardHeader>
                <CardTitle>{test.name}</CardTitle>
                <CardDescription>Category: {test.category?.name || 'N/A'}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">
                  {test.lowestPrice > 0 ? `Starting from ৳${test.lowestPrice}` : 'Price: N/A'}
                </p>
                <p className="text-sm text-muted-foreground">Available at {test.availableHospitals} hospitals</p>
                <Link href={`/tests/${test.id}`} passHref>
                  <Button variant="link" className="mt-2 p-0" asChild>View Details</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No medical tests found.</p>
        </div>
      )}
    </div>
  );
}