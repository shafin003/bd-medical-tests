export interface SearchRequest {
  query: string;
  filters: {
    city?: string;
    division?: string;
    area?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    facilities?: string[];
    insurance?: string[];
    testCategory?: string;
    homeCollection?: boolean;
  };
  sort?: 'price_asc' | 'price_desc' | 'rating_desc' | 'distance' | 'popularity';
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  hospitals: (Hospital & {
    matchingTests: (MedicalTest & HospitalService)[];
    distance?: number;
    relevanceScore: number;
  })[];
  tests: (MedicalTest & {
    category: TestCategory;
    lowestPrice: number;
    highestPrice: number;
    availableHospitals: number;
  })[];
  totalResults: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CompareRequest {
  hospitalIds: string[];
  testId?: string;
}

export interface CompareResponse {
  hospitals: (Hospital & {
    services: (HospitalService & { test: MedicalTest })[];
  })[];
  testComparison?: {
    test: MedicalTest;
    prices: {
      hospitalId: string;
      hospitalName: string;
      price: number;
      discountedPrice?: number;
      homeCollectionFee: number;
      deliveryTime?: string;
    }[];
  };
}

export interface PriceRangeResponse {
  testId: string;
  testName: string;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  priceDistribution: {
    range: string;
    count: number;
  }[];
}

import { Hospital, MedicalTest, HospitalService, TestCategory } from './database';
