"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FAQPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <Card>
        <CardHeader>
          <CardTitle>Common Questions</CardTitle>
          <CardDescription>Find answers to the most common questions about our service.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Q: How do I compare prices?</p>
          <p>A: Use the search bar on the homepage to find tests or hospitals, then select items for comparison.</p>
          <p className="mt-4">More FAQs coming soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}
