export type ISODateTime = string;

export interface UserResource {
    id: number;
    username: string | null;
    slug: string | null;
    name: string;
    surname: string | null;
    email: string;
    email_verified_at: ISODateTime | null;
    role: string;
    title: string;
    phone: string | null;
    region: string | null;
    bio: string | null;
    image_url: string | null;
    active: boolean;
    created_at: ISODateTime;
    updated_at: ISODateTime;
    permissions?: UserPermissionResource[];
    properties?: PropertyResource[];
}

export type ConsultantResource = UserResource;

export interface UserPermissionResource {
    id: number;
    user_id: number;
    permission: string;
    allowed: boolean;
    created_at: ISODateTime;
    updated_at: ISODateTime;
}

export interface PropertyResource {
    id: number;
    title: string;
    slug: string;
    description: string;
    price: number;
    city: string;
    district: string;
    neighborhood: string | null;
    address: string | null;
    property_type: string;
    listing_type: string;
    square_meters: number;
    room_count: string;
    building_age: string | null;
    floor: string | null;
    total_floors: string | null;
    heating: string | null;
    bathroom_count: number | null;
    balcony: boolean;
    furnished: boolean;
    usage_status: string | null;
    deed_status: string | null;
    credit_eligible: boolean;
    status: string;
    featured: boolean;
    consultant_id: number | null;
    created_at: ISODateTime;
    updated_at: ISODateTime;
    consultant?: UserResource | null;
    images?: PropertyImageResource[];
}

export interface PropertyImageResource {
    id: number;
    property_id: number;
    image_url: string;
    alt: string | null;
    sort_order: number;
    created_at: ISODateTime;
}

export interface ContactRequestResource {
    id: number;
    property_id: number | null;
    name: string;
    phone: string;
    email: string | null;
    message: string;
    status: string;
    created_at: ISODateTime;
    property?: PropertyResource | null;
}
