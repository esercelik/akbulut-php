export type ListingStatus = string;

export type PropertyType = string;

export type Property = {
  id: string | number;
  slug: string;
  listingNo?: string | null;
  listingDate?: string | null;
  updatedDate?: string | null;
  title: string;
  city: string;
  district: string;
  neighborhood: string | null;
  address?: string | null;
  price: number | string | null;
  area: number;
  rooms: string;
  baths: number;
  status: ListingStatus;
  type: PropertyType;
  image: string;
  gallery?: string[];
  featured: boolean;
  description: string;
  features: string[];
  specifications?: {
    label: string;
    value: string;
  }[];
  advisor: {
    id?: number | string | null;
    slug?: string | null;
    name: string;
    title?: string | null;
    phone: string | null;
    email: string | null;
    avatar?: string | null;
    url?: string | null;
  };
};
