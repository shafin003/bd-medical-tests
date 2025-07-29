"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('query') || '';

  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [division, setDivision] = useState(searchParams.get('division') || '');
  const [area, setArea] = useState(searchParams.get('area') || '');
  const [priceRange, setPriceRange] = useState([0, 5000]); // Default price range
  const [rating, setRating] = useState(0);
  const [facilities, setFacilities] = useState([]);
  const [testCategory, setTestCategory] = useState(searchParams.get('testCategory') || '');
  const [homeCollection, setHomeCollection] = useState(false);

  // Sort state
  const [sort, setSort] = useState(searchParams.get('sort') || 'relevance');

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!initialQuery) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const currentFilters = {
        city: city || undefined,
        division: division || undefined,
        area: area || undefined,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 5000 ? priceRange[1] : undefined,
        rating: rating > 0 ? rating : undefined,
        facilities: facilities.length > 0 ? facilities : undefined,
        testCategory: testCategory || undefined,
        homeCollection: homeCollection || undefined,
      };

      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: initialQuery,
            filters: currentFilters,
            sort: sort === 'relevance' ? undefined : sort,
            page: 1,
            limit: 10, // Initial limit
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSearchResults(data);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("Failed to load search results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [initialQuery, city, division, area, priceRange, rating, facilities, testCategory, homeCollection, sort]);

  const handleApplyFilters = () => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('query', initialQuery);
    if (city) newSearchParams.set('city', city);
    if (division) newSearchParams.set('division', division);
    if (area) newSearchParams.set('area', area);
    if (priceRange[0] > 0) newSearchParams.set('minPrice', priceRange[0].toString());
    if (priceRange[1] < 5000) newSearchParams.set('maxPrice', priceRange[1].toString());
    if (rating > 0) newSearchParams.set('rating', rating.toString());
    if (facilities.length > 0) newSearchParams.set('facilities', facilities.join(','));
    if (testCategory) newSearchParams.set('testCategory', testCategory);
    if (homeCollection) newSearchParams.set('homeCollection', 'true');
    if (sort !== 'relevance') newSearchParams.set('sort', sort);

    router.push(`/search-results?${newSearchParams.toString()}`);
  };

  const handleClearFilters = () => {
    setCity('');
    setDivision('');
    setArea('');
    setPriceRange([0, 5000]);
    setRating(0);
    setFacilities([]);
    setTestCategory('');
    setHomeCollection(false);
    setSort('relevance');

    router.push(`/search-results?query=${encodeURIComponent(initialQuery)}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Searching for "{initialQuery}"...</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
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

  if (!searchResults || (searchResults.hospitals.length === 0 && searchResults.tests.length === 0)) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">No Results Found</h1>
        <p className="text-lg text-muted-foreground">No hospitals or tests matched your search for "{initialQuery}".</p>
        <Button className="mt-6" onClick={() => router.push('/')}>Go Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Filter Sidebar */}
      <aside className="md:col-span-1 space-y-6">
        <h2 className="text-2xl font-bold mb-4">Filters</h2>

        {/* Location Filter */}
        <Collapsible className="border rounded-md p-4">
          <CollapsibleTrigger className="flex justify-between items-center w-full font-semibold">
            Location <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-3">
            <Input placeholder="Division" value={division} onChange={(e) => setDivision(e.target.value)} />
            <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
            <Input placeholder="Area" value={area} onChange={(e) => setArea(e.target.value)} />
          </CollapsibleContent>
        </Collapsible>

        {/* Price Range Filter */}
        <Collapsible className="border rounded-md p-4">
          <CollapsibleTrigger className="flex justify-between items-center w-full font-semibold">
            Price Range <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-3">
            <Label>Min: ৳{priceRange[0]} - Max: ৳{priceRange[1]}</Label>
            <Slider
              min={0}
              max={5000}
              step={50}
              value={priceRange}
              onValueChange={setPriceRange}
              range
            />
          </CollapsibleContent>
        </Collapsible>

        {/* Rating Filter */}
        <Collapsible className="border rounded-md p-4">
          <CollapsibleTrigger className="flex justify-between items-center w-full font-semibold">
            Rating <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-3">
            <Label>Minimum Rating: {rating} Stars</Label>
            <Slider
              min={0}
              max={5}
              step={1}
              value={[rating]}
              onValueChange={(val) => setRating(val[0])}
            />
          </CollapsibleContent>
        </Collapsible>

        {/* Facilities Filter (Example) */}
        <Collapsible className="border rounded-md p-4">
          <CollapsibleTrigger className="flex justify-between items-center w-full font-semibold">
            Facilities <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="homeCollection" checked={homeCollection} onCheckedChange={setHomeCollection} />
              <Label htmlFor="homeCollection">Home Collection Available</Label>
            </div>
            {/* Add more facility checkboxes here */}
          </CollapsibleContent>
        </Collapsible>

        {/* Test Category Filter (Placeholder) */}
        <Collapsible className="border rounded-md p-4">
          <CollapsibleTrigger className="flex justify-between items-center w-full font-semibold">
            Test Category <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-3">
            <Input placeholder="e.g., Blood Test" value={testCategory} onChange={(e) => setTestCategory(e.target.value)} />
          </CollapsibleContent>
        </Collapsible>

        <div className="flex gap-2">
          <Button onClick={handleApplyFilters} className="w-full">Apply Filters</Button>
          <Button variant="outline" onClick={handleClearFilters} className="w-full">Clear Filters</Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="md:col-span-3">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Search Results for "{initialQuery}"</h1>
          {/* Sort Dropdown */}
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="rating_desc">Rating</SelectItem>
              {/* Add more sort options as needed */}
            </SelectContent>
          </Select>
        </div>

        {searchResults.hospitals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Hospitals ({searchResults.hospitals.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.hospitals.map((hospital) => (
                <Card key={hospital.id}>
                  <CardHeader>
                    <CardTitle>{hospital.name}</CardTitle>
                    <CardDescription>{hospital.full_address}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Rating: {hospital.rating} ({hospital.total_reviews} reviews)</p>
                    <Link href={`/hospitals/${hospital.id}`} passHref>
                      <Button variant="link" className="mt-2 p-0">View Hospital</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {searchResults.tests.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Tests ({searchResults.tests.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.tests.map((test) => (
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
                      <Button variant="link" className="mt-2 p-0">View Details</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}