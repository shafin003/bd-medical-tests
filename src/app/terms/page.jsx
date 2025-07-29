"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <Card>
        <CardHeader>
          <CardTitle>Our Service Agreement</CardTitle>
          <CardDescription>The terms and conditions governing your use of our platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is a placeholder for the Terms of Service content.</p>
          <p className="mt-4">By using our service, you agree to these terms and conditions.</p>
        </CardContent>
      </Card>
    </div>
  );
}
