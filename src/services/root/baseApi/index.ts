'use server';
import { updateTag } from 'next/cache';
import { getValidToken } from '../handleToken';

type TRequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  data?: any;
  requiresAuth?: boolean;
  tags?: string[];
  revalidateTag?: string[];
  revalidate?: number | false;
  params?: Record<string, string | number | string[] | undefined>;
};

export const baseApi = async (endpoint: string, options: TRequestOptions = {}): Promise<any> => {
  const {
    method = 'GET',
    data,
    requiresAuth = undefined,
    tags = [],
    revalidateTag = [],
    revalidate = false,
    params,
  } = options;

  const url = new URL(`https://api.mycdlclass.com/api/v1${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((val) => {
            url.searchParams.append(key, val.toString());
          });
        } else {
          url.searchParams.append(key, value.toString());
        }
      }
    });
  }

  const headers = new Headers();

  if (requiresAuth) {
    const token = await getValidToken();
    if (!token) {
      return {
        success: false,
        statusCode: 401,
        data: { message: 'User not authenticated' },
      };
    }
    headers.append('Authorization', `Bearer ${token}`);
  }

  let body: any = undefined;
  if (data) {
    if (data instanceof FormData) {
      body = data;
    } else {
      headers.append('Content-Type', 'application/json');
      body = JSON.stringify(data);
    }
  }

  try {
    const res = await fetch(url.toString(), {
      method,
      headers,
      credentials: 'include',
      body,
      next: {
        ...(tags.length > 0 && { tags }),
        ...(revalidate !== false && { revalidate }),
      },
    });

    const result = await res.json();

    if (method !== 'GET' && revalidateTag.length > 0) {
      revalidateTag.forEach((tag) => updateTag(tag));
    }

    return result;
  } catch (error: any) {
    throw error;
  }
};
