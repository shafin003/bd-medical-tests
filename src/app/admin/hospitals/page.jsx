"use client";

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Hospital } from '@/types/api';

export default function AdminHospitalsPage() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentHospital, setCurrentHospital] = useState(null); // For editing
  const { addToast } = useToast();
  const router = useRouter();

  // Form states
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [division, setDivision] = useState('');
  const [area, setArea] = useState('');
  const [road, setRoad] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [establishedYear, setEstablishedYear] = useState('');
  const [totalBeds, setTotalBeds] = useState('');
  const [verified, setVerified] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [emergencyService, setEmergencyService] = useState(false);
  const [homeCollection, setHomeCollection] = useState(false);
  const [parkingAvailable, setParkingAvailable] = useState(false);
  const [wheelchairAccessible, setWheelchairAccessible] = useState(false);
  const [facilities, setFacilities] = useState(''); // Comma separated string
  const [insuranceAccepted, setInsuranceAccepted] = useState(''); // Comma separated string
  const [departments, setDepartments] = useState(''); // Comma separated string
  const [images, setImages] = useState(''); // Comma separated string

  const resetForm = () => {
    setName('');
    setCity('');
    setDivision('');
    setArea('');
    setRoad('');
    setHouseNumber('');
    setFullAddress('');
    setPhone('');
    setEmail('');
    setWebsite('');
    setDescription('');
    setEstablishedYear('');
    setTotalBeds('');
    setVerified(false);
    setFeatured(false);
    setEmergencyService(false);
    setHomeCollection(false);
    setParkingAvailable(false);
    setWheelchairAccessible(false);
    setFacilities('');
    setInsuranceAccepted('');
    setDepartments('');
    setImages('');
    setCurrentHospital(null);
  };

  const populateForm = (hospital) => {
    setCurrentHospital(hospital);
    setName(hospital.name || '');
    setCity(hospital.city || '');
    setDivision(hospital.division || '');
    setArea(hospital.area || '');
    setRoad(hospital.road || '');
    setHouseNumber(hospital.house_number || '');
    setFullAddress(hospital.full_address || '');
    setPhone(hospital.phone || '');
    setEmail(hospital.email || '');
    setWebsite(hospital.website || '');
    setDescription(hospital.description || '');
    setEstablishedYear(hospital.established_year || '');
    setTotalBeds(hospital.total_beds || '');
    setVerified(hospital.verified || false);
    setFeatured(hospital.featured || false);
    setEmergencyService(hospital.emergency_service || false);
    setHomeCollection(hospital.home_collection || false);
    setParkingAvailable(hospital.parking_available || false);
    setWheelchairAccessible(hospital.wheelchair_accessible || false);
    setFacilities(hospital.facilities ? hospital.facilities.join(', ') : '');
    setInsuranceAccepted(hospital.insurance_accepted ? hospital.insurance_accepted.join(', ') : '');
    setDepartments(hospital.departments ? hospital.departments.join(', ') : '');
    setImages(hospital.images ? hospital.images.join(', ') : '');
    setIsDialogOpen(true);
  };

  const fetchHospitals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/hospitals');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHospitals(data);
    } catch (err) {
      console.error("Error fetching hospitals:", err);
      setError("Failed to load hospitals.");
      addToast({
        title: "Error",
        description: "Failed to load hospitals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const hospitalData = {
      name,
      city,
      division,
      area,
      road: road || null,
      house_number: houseNumber || null,
      full_address: fullAddress,
      phone: phone || null,
      email: email || null,
      website: website || null,
      description: description || null,
      established_year: establishedYear ? parseInt(establishedYear) : null,
      total_beds: totalBeds ? parseInt(totalBeds) : null,
      verified,
      featured,
      emergency_service: emergencyService,
      home_collection: homeCollection,
      parking_available: parkingAvailable,
      wheelchair_accessible: wheelchairAccessible,
      facilities: facilities.split(',').map(f => f.trim()).filter(f => f) || [],
      insurance_accepted: insuranceAccepted.split(',').map(i => i.trim()).filter(i => i) || [],
      departments: departments.split(',').map(d => d.trim()).filter(d => d) || [],
      images: images.split(',').map(img => img.trim()).filter(img => img) || [],
    };

    try {
      let response;
      if (currentHospital) {
        // Update existing hospital
        response = await fetch(`/api/admin/hospitals/${currentHospital.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(hospitalData),
        });
      } else {
        // Add new hospital
        response = await fetch('/api/admin/hospitals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(hospitalData),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      addToast({
        title: currentHospital ? "Hospital Updated" : "Hospital Added",
        description: currentHospital ? "Hospital details have been updated." : "New hospital has been added.",
      });
      setIsDialogOpen(false);
      resetForm();
      fetchHospitals(); // Refresh list
    } catch (err) {
      console.error("Error saving hospital:", err);
      setError("Failed to save hospital.");
      addToast({
        title: "Error",
        description: "Failed to save hospital. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this hospital?")) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/hospitals/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      addToast({
        title: "Hospital Deleted",
        description: "Hospital has been successfully deleted.",
      });
      fetchHospitals(); // Refresh list
    } catch (err) {
      console.error("Error deleting hospital:", err);
      setError("Failed to delete hospital.");
      toast({
        title: "Error",
        description: "Failed to delete hospital. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Hospital Management</h1>
        <p>Loading hospitals...</p>
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Hospital Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>Add New Hospital</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{currentHospital ? "Edit Hospital" : "Add New Hospital"}</DialogTitle>
              <DialogDescription>
                {currentHospital ? "Edit the details of the hospital." : "Fill in the details to add a new hospital."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fullAddress" className="text-right">Full Address</Label>
                <Input id="fullAddress" value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right">City</Label>
                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="division" className="text-right">Division</Label>
                <Input id="division" value={division} onChange={(e) => setDivision(e.target.value)} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="area" className="text-right">Area</Label>
                <Input id="area" value={area} onChange={(e) => setArea(e.target.value)} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="road" className="text-right">Road</Label>
                <Input id="road" value={road} onChange={(e) => setRoad(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="houseNumber" className="text-right">House Number</Label>
                <Input id="houseNumber" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="website" className="text-right">Website</Label>
                <Input id="website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="establishedYear" className="text-right">Established Year</Label>
                <Input id="establishedYear" type="number" value={establishedYear} onChange={(e) => setEstablishedYear(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="totalBeds" className="text-right">Total Beds</Label>
                <Input id="totalBeds" type="number" value={totalBeds} onChange={(e) => setTotalBeds(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="facilities" className="text-right">Facilities (comma-separated)</Label>
                <Input id="facilities" value={facilities} onChange={(e) => setFacilities(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="insuranceAccepted" className="text-right">Insurance Accepted (comma-separated)</Label>
                <Input id="insuranceAccepted" value={insuranceAccepted} onChange={(e) => setInsuranceAccepted(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="departments" className="text-right">Departments (comma-separated)</Label>
                <Input id="departments" value={departments} onChange={(e) => setDepartments(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="images" className="text-right">Image URLs (comma-separated)</Label>
                <Input id="images" value={images} onChange={(e) => setImages(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="verified" className="text-right">Verified</Label>
                <Switch id="verified" checked={verified} onCheckedChange={setVerified} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="featured" className="text-right">Featured</Label>
                <Switch id="featured" checked={featured} onCheckedChange={setFeatured} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="emergencyService" className="text-right">Emergency Service</Label>
                <Switch id="emergencyService" checked={emergencyService} onCheckedChange={setEmergencyService} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="homeCollection" className="text-right">Home Collection</Label>
                <Switch id="homeCollection" checked={homeCollection} onCheckedChange={setHomeCollection} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="parkingAvailable" className="text-right">Parking Available</Label>
                <Switch id="parkingAvailable" checked={parkingAvailable} onCheckedChange={setParkingAvailable} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="wheelchairAccessible" className="text-right">Wheelchair Accessible</Label>
                <Switch id="wheelchairAccessible" checked={wheelchairAccessible} onCheckedChange={setWheelchairAccessible} className="col-span-3" />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Hospital"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map((hospital) => (
          <Card key={hospital.id}>
            <CardHeader>
              <CardTitle>{hospital.name}</CardTitle>
              <CardDescription>{hospital.full_address}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Rating: {hospital.rating}</p>
                <p className="text-sm text-muted-foreground">Verified: {hospital.verified ? 'Yes' : 'No'}</p>
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => populateForm(hospital)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(hospital.id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
