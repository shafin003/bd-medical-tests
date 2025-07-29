"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Privacy Matters</CardTitle>
          <CardDescription>Details on how we collect, use, and protect your data.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is a placeholder for the Privacy Policy content.</p>
          <p className="mt-4">We are committed to protecting your privacy. This policy outlines how we handle your information.</p>
        </CardContent>
      </Card>
    </div>
  );
}
