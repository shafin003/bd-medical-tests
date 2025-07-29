"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HelpPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Help Center</h1>
      <Card>
        <CardHeader>
          <CardTitle>Need Assistance?</CardTitle>
          <CardDescription>Find guides and support resources here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>If you need help, please refer to our FAQ section or contact support.</p>
          <p className="mt-4">More help topics coming soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}
