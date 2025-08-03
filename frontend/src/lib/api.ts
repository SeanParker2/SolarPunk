// frontend/src/lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface Photo {
  id: string;
  public_id: string;
  title: string;
  tags: string[];
  thumbnail_url: string;
  aspect_ratio: number;
  download_count: number;
  is_featured: boolean;
}

export interface PhotoDetail {
  public_id: string;
  title: string;
  tags: string[];
  download_url: string;
  aspect_ratio: number;
  license: string;
}

export interface PhotoListResponse {
  items: Photo[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export async function fetchPhotos(
  page: number = 1, 
  limit: number = 20, 
  search?: string, 
  tags?: string[]
): Promise<PhotoListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  if (search && search.trim()) {
    params.append('q', search.trim());
  }
  
  if (tags && tags.length > 0) {
    params.append('tags', tags.join(','));
  }
  
  const response = await fetch(`${API_BASE_URL}/photos?${params}`, {
    cache: 'no-store'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch photos');
  }
  
  return response.json();
}

export async function fetchPhotoDetail(publicId: string): Promise<PhotoDetail> {
  const response = await fetch(`${API_BASE_URL}/photos/${publicId}`, {
    cache: 'no-store'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch photo detail');
  }
  
  return response.json();
}

// Collections related types and functions
export interface Collection {
  id: string;
  title: string;
  description?: string;
  slug: string;
  cover_photo_id?: string;
  cover_photo?: Photo;
  is_published: boolean;
  view_count: number;
  photo_count: number;
  created_at: string;
  updated_at: string;
}

export interface CollectionDetail {
  id: string;
  title: string;
  description?: string;
  slug: string;
  cover_photo_id?: string;
  cover_photo?: Photo;
  is_published: boolean;
  view_count: number;
  photos: Photo[];
  created_at: string;
  updated_at: string;
}

export interface CollectionListResponse {
  items: Collection[];
  total: number;
  page: number;
  pages: number;
}

export async function fetchCollections(
  page: number = 1,
  limit: number = 12,
  publishedOnly: boolean = true
): Promise<CollectionListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    published_only: publishedOnly.toString()
  });
  
  const response = await fetch(`${API_BASE_URL}/collections?${params}`, {
    cache: 'no-store'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch collections');
  }
  
  return response.json();
}

export async function fetchCollectionBySlug(slug: string): Promise<CollectionDetail> {
  const response = await fetch(`${API_BASE_URL}/collections/${slug}`, {
    cache: 'no-store'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch collection');
  }
  
  return response.json();
}