"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <Card>
        <CardHeader>
          <CardTitle>Get in Touch</CardTitle>
          <CardDescription>Have questions or feedback? Reach out to us.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Email: support@meditestbd.com</p>
          <p>Phone: +880 1XXXXXXXXX</p>
          <p className="mt-4">We aim to respond within 24-48 hours.</p>
        </CardContent>
      </Card>
    </div>
  );
}
