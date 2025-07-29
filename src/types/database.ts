export interface Hospital {
  id: string;
  name: string;
  city: string;
  division: string;
  area: string;
  road?: string;
  house_number?: string;
  full_address: string;
  phone?: string;
  email?: string;
  website?: string;
  rating: number;
  total_reviews: number;
  facilities: string[];
  insurance_accepted: string[];
  operating_hours: Record<string, string>;
  emergency_service: boolean;
  home_collection: boolean;
  parking_available: boolean;
  wheelchair_accessible: boolean;
  latitude?: number;
  longitude?: number;
  verified: boolean;
  featured: boolean;
  images: string[];
  description?: string;
  established_year?: number;
  total_beds?: number;
  departments: string[];
  created_at: string;
  updated_at: string;
}

export interface MedicalTest {
  id: string;
  name: string;
  category_id: string;
  description?: string;
  purpose?: string;
  preparation_instructions?: string;
  fasting_required: boolean;
  normal_range?: string;
  turnaround_time?: string;
  sample_type?: string;
  aliases: string[];
  keywords: string[];
  common_symptoms: string[];
  age_restrictions?: string;
  gender_specific: 'male' | 'female' | 'both';
  created_at: string;
}

export interface HospitalService {
  id: string;
  hospital_id: string;
  test_id: string;
  price: number;
  discounted_price?: number;
  discount_percentage?: number;
  available: boolean;
  home_collection_available: boolean;
  home_collection_fee: number;
  report_delivery_time?: string;
  online_report: boolean;
  emergency_available: boolean;
  notes?: string;
  last_updated: string;
  created_at: string;
}

export interface TestCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  parent_category_id?: string;
  sort_order: number;
}

export interface Review {
  id: string;
  hospital_id: string;
  reviewer_name?: string;
  rating: number;
  comment?: string;
  test_taken?: string;
  experience_date?: string;
  helpful_count: number;
  verified: boolean;
  approved: boolean;
  created_at: string;
}
