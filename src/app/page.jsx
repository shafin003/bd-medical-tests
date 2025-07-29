"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Debounce for autocomplete suggestions
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchQuery.length > 2) { // Only fetch suggestions if query is at least 3 characters
        try {
          const response = await fetch(`/api/search/autocomplete?query=${encodeURIComponent(searchQuery)}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setAutocompleteSuggestions(data);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error fetching autocomplete suggestions:", error);
          setAutocompleteSuggestions([]);
        }
      } else {
        setAutocompleteSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300); // 300ms debounce for autocomplete

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setLoading(true);
      setShowSuggestions(false);
      router.push(`/search-results?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    router.push(`/search-results?query=${encodeURIComponent(suggestion)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)]">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-500 to-teal-500 text-white flex flex-col items-center">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
              Compare Medical Test Prices in Bangladesh
            </h1>
            <p className="text-l md:text-xl lg:text-xl text-white/90">
              Find the best prices for medical tests from top hospitals and diagnostic centers.
            </p>
            <div className="w-full max-w-xl mx-auto flex gap-2 relative">
              <Input
                type="search"
                placeholder="Search for tests, hospitals, or locations..."
                className="flex-1 h-12 text-lg px-4 rounded-lg border-none focus:ring-2 focus:ring-blue-800 text-gray-900 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 2 && autocompleteSuggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // Delay hiding to allow click
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <Button
                size="lg"
                className="h-12 px-6 bg-white text-sky-600 font-semibold hover:bg-gray-100 hover:text-white hover:bg-sky-600 cursor-pointer [transition:all_0.3s_ease-in-out] rounded-lg"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? "Searching..." : <><Search className="h-5 w-5 font-semibold" /> Search</>}
              </Button>
              {showSuggestions && autocompleteSuggestions.length > 0 && (
                <ul className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                  {autocompleteSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-800 text-left"
                      onMouseDown={() => handleSuggestionClick(suggestion)} // Use onMouseDown to prevent onBlur from firing first
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tests Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background flex flex-col items-center">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Popular Medical Tests</h2>
            <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Explore the most frequently searched and compared medical tests.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Placeholder for Popular Test Cards */}
            <Card>
              <CardHeader>
                <CardTitle>CBC Test</CardTitle>
                <CardDescription>Complete Blood Count</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">Starting from ৳500</p>
                <Button variant="link" className="mt-2 p-0">View Details</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Urine R/M/E</CardTitle>
                <CardDescription>Urine Routine, Microscopic & Chemical Examination</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">Starting from ৳300</p>
                <Button variant="link" className="mt-2 p-0">View Details</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Blood Sugar (Fasting)</CardTitle>
                <CardDescription>Fasting Blood Glucose Test</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">Starting from ৳250</p>
                <Button variant="link" className="mt-2 p-0">View Details</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Lipid Profile</CardTitle>
                <CardDescription>Cholesterol, Triglycerides, HDL, LDL</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">Starting from ৳1200</p>
                <Button variant="link" className="mt-2 p-0">View Details</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Hospitals Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted flex flex-col items-center">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Hospitals</h2>
            <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover top-rated hospitals and diagnostic centers in Bangladesh.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for Featured Hospital Cards */}
            <Card>
              <CardHeader>
                <CardTitle>Square Hospital</CardTitle>
                <CardDescription>Dhaka, Bangladesh</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Rating: 4.8 (1200 reviews)</p>
                <p className="text-sm text-muted-foreground">Facilities: Parking, Wheelchair Access</p>
                <Button variant="link" className="mt-2 p-0">View Hospital</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>United Hospital</CardTitle>
                <CardDescription>Dhaka, Bangladesh</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Rating: 4.7 (950 reviews)</p>
                <p className="text-sm text-muted-foreground">Facilities: Home Collection, Emergency</p>
                <Button variant="link" className="mt-2 p-0">View Hospital</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Apollo Hospitals Dhaka</CardTitle>
                <CardDescription>Dhaka, Bangladesh</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Rating: 4.6 (800 reviews)</p>
                <p className="text-sm text-muted-foreground">Facilities: Insurance Accepted, Online Report</p>
                <Button variant="link" className="mt-2 p-0">View Hospital</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background flex flex-col items-center">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
            <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Getting the best medical test prices is simple with MediTest BD.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">Search for Tests</h3>
              <p className="text-muted-foreground">Enter the medical test you need or symptoms you have.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">Compare Prices</h3>
              <p className="text-muted-foreground">View prices from various hospitals and diagnostic centers.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">Make an Informed Choice</h3>
              <p className="text-muted-foreground">Select the best option based on price, location, and reviews.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}