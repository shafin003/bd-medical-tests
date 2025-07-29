"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function AdminAnalyticsPage() {
  const [popularSearches, setPopularSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/admin/analytics');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPopularSearches(data.popularSearches || []);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError("Failed to load analytics data. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load analytics data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
        <p>Loading analytics data...</p>
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
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Popular Searches Card */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Searches</CardTitle>
            <CardDescription>Top 10 most searched queries.</CardDescription>
          </CardHeader>
          <CardContent>
            {popularSearches.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {popularSearches.map((search, index) => (
                  <li key={index} className="text-lg">
                    <span className="font-semibold">{search.query}</span> ({search.search_count} searches)
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No popular searches data available yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Placeholder for other analytics cards */}
        <Card>
          <CardHeader>
            <CardTitle>User Behavior</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Coming Soon: User behavior analytics.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hospital Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Coming Soon: Hospital performance metrics.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
