"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MedicalTest, TestCategory } from '@/types/api';

export default function AdminTestsPage() {
  const [tests, setTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState(null); // For editing tests
  const [currentCategory, setCurrentCategory] = useState(null); // For editing categories
  const { toast } = useToast();

  // Test Form states
  const [testName, setTestName] = useState('');
  const [testCategoryId, setTestCategoryId] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [testPurpose, setTestPurpose] = useState('');
  const [preparationInstructions, setPreparationInstructions] = useState('');
  const [fastingRequired, setFastingRequired] = useState(false);
  const [normalRange, setNormalRange] = useState('');
  const [turnaroundTime, setTurnaroundTime] = useState('');
  const [sampleType, setSampleType] = useState('');
  const [aliases, setAliases] = useState('');
  const [keywords, setKeywords] = useState('');
  const [commonSymptoms, setCommonSymptoms] = useState('');
  const [ageRestrictions, setAgeRestrictions] = useState('');
  const [genderSpecific, setGenderSpecific] = useState('both');

  // Category Form states
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('');
  const [categorySortOrder, setCategorySortOrder] = useState(0);

  // Bulk Price Update states
  const [selectedTestForBulkUpdate, setSelectedTestForBulkUpdate] = useState(null);
  const [bulkPriceUpdates, setBulkPriceUpdates] = useState([]);

  const resetTestForm = () => {
    setTestName('');
    setTestCategoryId('');
    setTestDescription('');
    setTestPurpose('');
    setPreparationInstructions('');
    setFastingRequired(false);
    setNormalRange('');
    setTurnaroundTime('');
    setSampleType('');
    setAliases('');
    setKeywords('');
    setCommonSymptoms('');
    setAgeRestrictions('');
    setGenderSpecific('both');
    setCurrentTest(null);
  };

  const populateTestForm = (test) => {
    setCurrentTest(test);
    setTestName(test.name || '');
    setTestCategoryId(test.category_id || '');
    setTestDescription(test.description || '');
    setTestPurpose(test.purpose || '');
    setPreparationInstructions(test.preparation_instructions || '');
    setFastingRequired(test.fasting_required || false);
    setNormalRange(test.normal_range || '');
    setTurnaroundTime(test.turnaround_time || '');
    setSampleType(test.sample_type || '');
    setAliases(test.aliases ? test.aliases.join(', ') : '');
    setKeywords(test.keywords ? test.keywords.join(', ') : '');
    setCommonSymptoms(test.common_symptoms ? test.common_symptoms.join(', ') : '');
    setAgeRestrictions(test.age_restrictions || '');
    setGenderSpecific(test.gender_specific || 'both');
    setIsTestDialogOpen(true);
  };

  const resetCategoryForm = () => {
    setCategoryName('');
    setCategoryDescription('');
    setCategoryIcon('');
    setCategorySortOrder(0);
    setCurrentCategory(null);
  };

  const populateCategoryForm = (category) => {
    setCurrentCategory(category);
    setCategoryName(category.name || '');
    setCategoryDescription(category.description || '');
    setCategoryIcon(category.icon || '');
    setCategorySortOrder(category.sort_order || 0);
    setIsCategoryDialogOpen(true);
  };

  const fetchTestsAndCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const [testsRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/tests'),
        fetch('/api/admin/test-categories'),
      ]);

      if (!testsRes.ok) throw new Error(`HTTP error! status: ${testsRes.status} for tests`);
      if (!categoriesRes.ok) throw new Error(`HTTP error! status: ${categoriesRes.status} for categories`);

      const testsData = await testsRes.json();
      const categoriesData = await categoriesRes.json();

      setTests(testsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error fetching tests or categories:", err);
      setError("Failed to load tests or categories.");
      toast({
        title: "Error",
        description: "Failed to load tests or categories. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestsAndCategories();
  }, []);

  const handleTestSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const testData = {
      name: testName,
      category_id: testCategoryId || null,
      description: testDescription || null,
      purpose: testPurpose || null,
      preparation_instructions: preparationInstructions || null,
      fasting_required: fastingRequired,
      normal_range: normalRange || null,
      turnaround_time: turnaroundTime || null,
      sample_type: sampleType || null,
      aliases: aliases.split(',').map(a => a.trim()).filter(a => a) || [],
      keywords: keywords.split(',').map(k => k.trim()).filter(k => k) || [],
      common_symptoms: commonSymptoms.split(',').map(s => s.trim()).filter(s => s) || [],
      age_restrictions: ageRestrictions || null,
      gender_specific: genderSpecific,
    };

    try {
      let response;
      if (currentTest) {
        response = await fetch(`/api/admin/tests/${currentTest.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testData),
        });
      } else {
        response = await fetch('/api/admin/tests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testData),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: currentTest ? "Test Updated" : "Test Added",
        description: currentTest ? "Test details have been updated." : "New test has been added.",
      });
      setIsTestDialogOpen(false);
      resetTestForm();
      fetchTestsAndCategories();
    } catch (err) {
      console.error("Error saving test:", err);
      setError("Failed to save test.");
      toast({
        title: "Error",
        description: "Failed to save test. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this test?")) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/tests/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Test Deleted",
        description: "Test has been successfully deleted.",
      });
      fetchTestsAndCategories();
    } catch (err) {
      console.error("Error deleting test:", err);
      setError("Failed to delete test.");
      toast({
        title: "Error",
        description: "Failed to delete test. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const categoryData = {
      name: categoryName,
      description: categoryDescription || null,
      icon: categoryIcon || null,
      sort_order: categorySortOrder,
    };

    try {
      let response;
      if (currentCategory) {
        response = await fetch(`/api/admin/test-categories/${currentCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryData),
        });
      } else {
        response = await fetch('/api/admin/test-categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryData),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: currentCategory ? "Category Updated" : "Category Added",
        description: currentCategory ? "Category details have been updated." : "New category has been added.",
      });
      setIsCategoryDialogOpen(false);
      resetCategoryForm();
      fetchTestsAndCategories();
    } catch (err) {
      console.error("Error saving category:", err);
      setError("Failed to save category.");
      toast({
        title: "Error",
        description: "Failed to save category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category? This will also affect tests linked to it.")) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/test-categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Category Deleted",
        description: "Category has been successfully deleted.",
      });
      fetchTestsAndCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Failed to delete category.");
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Test & Category Management</h1>
        <p>Loading data...</p>
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
      <h1 className="text-3xl font-bold mb-6">Test & Category Management</h1>

      {/* Test Management Section */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Medical Tests</CardTitle>
          <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetTestForm}>Add New Test</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{currentTest ? "Edit Medical Test" : "Add New Medical Test"}</DialogTitle>
                <DialogDescription>
                  {currentTest ? "Edit the details of the medical test." : "Fill in the details to add a new medical test."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleTestSubmit} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="testName" className="text-right">Name</Label>
                  <Input id="testName" value={testName} onChange={(e) => setTestName(e.target.value)} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="testCategoryId" className="text-right">Category</Label>
                  <Select value={testCategoryId} onValueChange={setTestCategoryId}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="testDescription" className="text-right">Description</Label>
                  <Textarea id="testDescription" value={testDescription} onChange={(e) => setTestDescription(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="testPurpose" className="text-right">Purpose</Label>
                  <Textarea id="testPurpose" value={testPurpose} onChange={(e) => setTestPurpose(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="preparationInstructions" className="text-right">Preparation Instructions</Label>
                  <Textarea id="preparationInstructions" value={preparationInstructions} onChange={(e) => setPreparationInstructions(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fastingRequired" className="text-right">Fasting Required</Label>
                  <Switch id="fastingRequired" checked={fastingRequired} onCheckedChange={setFastingRequired} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="normalRange" className="text-right">Normal Range</Label>
                  <Input id="normalRange" value={normalRange} onChange={(e) => setNormalRange(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="turnaroundTime" className="text-right">Turnaround Time</Label>
                  <Input id="turnaroundTime" value={turnaroundTime} onChange={(e) => setTurnaroundTime(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sampleType" className="text-right">Sample Type</Label>
                  <Input id="sampleType" value={sampleType} onChange={(e) => setSampleType(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="aliases" className="text-right">Aliases (comma-separated)</Label>
                  <Input id="aliases" value={aliases} onChange={(e) => setAliases(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="keywords" className="text-right">Keywords (comma-separated)</Label>
                  <Input id="keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="commonSymptoms" className="text-right">Common Symptoms (comma-separated)</Label>
                  <Input id="commonSymptoms" value={commonSymptoms} onChange={(e) => setCommonSymptoms(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ageRestrictions" className="text-right">Age Restrictions</Label>
                  <Input id="ageRestrictions" value={ageRestrictions} onChange={(e) => setAgeRestrictions(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="genderSpecific" className="text-right">Gender Specific</Label>
                  <Select value={genderSpecific} onValueChange={setGenderSpecific}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="both">Both</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Test"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fasting</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tests.map((test) => (
                  <tr key={test.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{test.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.test_categories?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.fasting_required ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="outline" size="sm" onClick={() => populateTestForm(test)} className="mr-2">
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleTestDelete(test.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Test Category Management Section */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Test Categories</CardTitle>
          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetCategoryForm}>Add New Category</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{currentCategory ? "Edit Test Category" : "Add New Test Category"}</DialogTitle>
                <DialogDescription>
                  {currentCategory ? "Edit the details of the test category." : "Fill in the details to add a new test category."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCategorySubmit} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categoryName" className="text-right">Name</Label>
                  <Input id="categoryName" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categoryDescription" className="text-right">Description</Label>
                  <Textarea id="categoryDescription" value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categoryIcon" className="text-right">Icon URL</Label>
                  <Input id="categoryIcon" value={categoryIcon} onChange={(e) => setCategoryIcon(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categorySortOrder" className="text-right">Sort Order</Label>
                  <Input id="categorySortOrder" type="number" value={categorySortOrder} onChange={(e) => setCategorySortOrder(parseInt(e.target.value))} className="col-span-3" />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Category"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sort Order</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.description || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.sort_order}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="outline" size="sm" onClick={() => populateCategoryForm(category)} className="mr-2">
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleCategoryDelete(category.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Price Update Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Bulk Price Update</CardTitle>
          <CardDescription>Update prices for a specific test across multiple hospitals.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="selectTestForBulkUpdate" className="text-right">Select Test</Label>
              <Select onValueChange={handleSelectTestForBulkUpdate} value={selectedTestForBulkUpdate || ''}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a test to update prices" />
                </SelectTrigger>
                <SelectContent>
                  {tests.map(test => (
                    <SelectItem key={test.id} value={test.id}>{test.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {bulkPriceUpdates.length > 0 && (
              <div className="overflow-x-auto">
                <h3 className="text-lg font-semibold mb-2">Prices for {tests.find(t => t.id === selectedTestForBulkUpdate)?.name}</h3>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discounted Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Home Collection Fee</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bulkPriceUpdates.map(service => (
                      <tr key={service.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.hospital_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">৳{service.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Input
                            type="number"
                            value={service.new_price !== undefined ? service.new_price : service.price}
                            onChange={(e) => handleBulkPriceChange(service.id, 'new_price', parseFloat(e.target.value))}
                            className="w-24"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Input
                            type="number"
                            value={service.new_discounted_price !== undefined ? service.new_discounted_price : (service.discounted_price || '')}
                            onChange={(e) => handleBulkPriceChange(service.id, 'new_discounted_price', parseFloat(e.target.value))}
                            className="w-24"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Input
                            type="number"
                            value={service.new_home_collection_fee !== undefined ? service.new_home_collection_fee : (service.home_collection_fee || '')}
                            onChange={(e) => handleBulkPriceChange(service.id, 'new_home_collection_fee', parseFloat(e.target.value))}
                            className="w-24"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Button onClick={handleSaveBulkUpdates} className="mt-4" disabled={loading}>
                  {loading ? "Saving..." : "Save Bulk Updates"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetCategoryForm}>Add New Category</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{currentCategory ? "Edit Test Category" : "Add New Test Category"}</DialogTitle>
                <DialogDescription>
                  {currentCategory ? "Edit the details of the test category." : "Fill in the details to add a new test category."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCategorySubmit} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categoryName" className="text-right">Name</Label>
                  <Input id="categoryName" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categoryDescription" className="text-right">Description</Label>
                  <Textarea id="categoryDescription" value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categoryIcon" className="text-right">Icon URL</Label>
                  <Input id="categoryIcon" value={categoryIcon} onChange={(e) => setCategoryIcon(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categorySortOrder" className="text-right">Sort Order</Label>
                  <Input id="categorySortOrder" type="number" value={categorySortOrder} onChange={(e) => setCategorySortOrder(parseInt(e.target.value))} className="col-span-3" />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Category"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sort Order</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.description || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.sort_order}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="outline" size="sm" onClick={() => populateCategoryForm(category)} className="mr-2">
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleCategoryDelete(category.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
