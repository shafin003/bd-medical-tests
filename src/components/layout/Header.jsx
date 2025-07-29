"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MenuIcon, Search } from "lucide-react";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search-results?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(""); // Clear search query after redirect
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-center">
      <div className="container px-4 flex h-14 items-center justify-between ">
        {/* Logo/Brand Name */}
        <Link href="/" className="mr-4 flex items-center">
          <span className="font-bold text-lg">MediTest BD</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                onClick={() => router.push("/")}
              >
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                onClick={() => router.push("/browse-tests")}
              >
                Browse Tests
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                onClick={() => router.push("/browse-hospitals")}
              >
                Browse Hospitals
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                onClick={() => router.push("/compare")}
              >
                Compare
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-sm mx-4 relative">
          <Input
            type="search"
            placeholder="Search tests, hospitals, locations..."
            className="w-full pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Admin Login Button (Desktop) */}
        <div className="hidden md:flex">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/login">Admin Login</Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>MediTest BD</SheetTitle>
                <SheetDescription>
                  Find and compare medical tests in Bangladesh.
                </SheetDescription>
              </SheetHeader>
              <nav className="grid gap-4 py-6">
                <Link href="/" className="text-lg font-semibold">
                  Home
                </Link>
                <Link href="/browse-tests" className="text-lg font-semibold">
                  Browse Tests
                </Link>
                <Link href="/browse-hospitals" className="text-lg font-semibold">
                  Browse Hospitals
                </Link>
                <Link href="/compare" className="text-lg font-semibold">
                  Compare
                </Link>
                <div className="mt-4 relative">
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full pr-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2"
                    onClick={handleSearch}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/admin/login">Admin Login</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}