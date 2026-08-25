const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4000/api";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type AdminRole =
  | "ADMIN"
  | "SUPER_ADMIN";

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  data: {
    admin: Admin;
    token: string;
  };
}

/* -------------------------------------------------------------------------- */
/* Resource Types                                                             */
/* -------------------------------------------------------------------------- */

export type ResourceType =
  | "SERMON"
  | "EBOOK"
  | "SONG"
  | "VIDEO"
  | "PODCAST"
  | "ARTICLE";

export type MediaType =
  | "AUDIO"
  | "PDF"
  | "IMAGE"
  | "VIDEO";

export type MediaProvider =
  | "R2"
  | "YOUTUBE"
  | "SUPABASE"
  | "EXTERNAL";

/* -------------------------------------------------------------------------- */
/* Category                                                                   */
/* -------------------------------------------------------------------------- */

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;

  createdAt?: string;
  updatedAt?: string;

  _count?: {
    resources?: number;
  };
}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string | null;
}

/* -------------------------------------------------------------------------- */
/* Tag                                                                        */
/* -------------------------------------------------------------------------- */

export interface AdminTag {
  id: string;
  name: string;
  slug: string;

  createdAt?: string;
  updatedAt?: string;

  _count?: {
    resources?: number;
  };
}

/* -------------------------------------------------------------------------- */
/* Media                                                                      */
/* -------------------------------------------------------------------------- */

export interface AdminMedia {
  id?: string;

  type: MediaType;

  provider: MediaProvider;

  title?: string | null;

  url?: string | null;

  storageKey?: string | null;

  externalId?: string | null;

  mimeType?: string | null;

  fileSize?: string | number | null;

  duration?: number | null;
}

/* -------------------------------------------------------------------------- */
/* Resource                                                                   */
/* -------------------------------------------------------------------------- */

export interface AdminResource {
  id: string;

  title: string;

  slug: string;

  description?: string | null;

  content?: string | null;

  type: ResourceType;

  speaker?: string | null;

  duration?: number | null;

  featured: boolean;

  published: boolean;

  publishedAt?: string | null;

  thumbnailId?: string | null;

  media?: AdminMedia[];

  categories?: Array<{
    resourceId?: string;
    categoryId?: string;
    category?: AdminCategory;
  }>;

  tags?: Array<{
    resourceId?: string;
    tagId?: string;
    tag?: AdminTag;
  }>;

  series?: {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
  } | null;

  createdAt?: string;

  updatedAt?: string;
}

/* -------------------------------------------------------------------------- */
/* Create Resource                                                            */
/* -------------------------------------------------------------------------- */

export interface CreateResourceInput {
  title: string;

  slug: string;

  description?: string;

  content?: string;

  type: ResourceType;

  speaker?: string;

  duration?: number;

  featured?: boolean;

  published?: boolean;

  publishedAt?: string | null;

  categoryIds?: string[];

  tagIds?: string[];

  seriesId?: string | null;

  media?: Array<{
    type: MediaType;

    provider: MediaProvider;

    title?: string;

    url?: string;

    storageKey?: string;

    externalId?: string;

    mimeType?: string;

    fileSize?: number;

    duration?: number;
  }>;
}

/* -------------------------------------------------------------------------- */
/* Update Resource                                                            */
/* -------------------------------------------------------------------------- */

export type UpdateResourceInput =
  Partial<CreateResourceInput>;

/* -------------------------------------------------------------------------- */
/* Token                                                                      */
/* -------------------------------------------------------------------------- */

const TOKEN_KEY =
  "olawale-smith-admin-token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(
  token: string,
) {
  localStorage.setItem(
    TOKEN_KEY,
    token,
  );
}

export function clearAdminToken() {
  localStorage.removeItem(
    TOKEN_KEY,
  );
}

/* -------------------------------------------------------------------------- */
/* Request Helper                                                             */
/* -------------------------------------------------------------------------- */

async function adminRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAdminToken();

  const headers = new Headers(
    options.headers,
  );

  headers.set(
    "Content-Type",
    "application/json",
  );

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`,
    );
  }

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,
      headers,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    let message =
      `Request failed (${response.status})`;

    try {
      const body =
        await response.json();

      if (body?.error) {
        message = body.error;
      }
    } catch {
      // Ignore invalid JSON responses.
    }

    throw new Error(message);
  }

  return response.json();
}

/* -------------------------------------------------------------------------- */
/* Authentication                                                             */
/* -------------------------------------------------------------------------- */

export async function adminLogin(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return adminRequest<LoginResponse>(
    "/admin/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    },
  );
}

export async function getCurrentAdmin(): Promise<{
  data: Admin;
}> {
  return adminRequest<{
    data: Admin;
  }>("/admin/auth/me");
}

/* -------------------------------------------------------------------------- */
/* Resources                                                                  */
/* -------------------------------------------------------------------------- */

export async function getAdminResources(): Promise<{
  data: AdminResource[];

  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {
  return adminRequest<{
    data: AdminResource[];

    meta?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>("/admin/resources");
}

export async function getAdminResource(
  id: string,
): Promise<{
  data: AdminResource;
}> {
  return adminRequest<{
    data: AdminResource;
  }>(
    `/admin/resources/${id}`,
  );
}

export async function createResource(
  input: CreateResourceInput,
): Promise<{
  data: AdminResource;
}> {
  return adminRequest<{
    data: AdminResource;
  }>("/admin/resources", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateResource(
  id: string,
  input: UpdateResourceInput,
): Promise<{
  data: AdminResource;
}> {
  return adminRequest<{
    data: AdminResource;
  }>(
    `/admin/resources/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function deleteResource(
  id: string,
): Promise<{
  data: {
    success: boolean;
  };
}> {
  return adminRequest<{
    data: {
      success: boolean;
    };
  }>(
    `/admin/resources/${id}`,
    {
      method: "DELETE",
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Categories                                                                 */
/* -------------------------------------------------------------------------- */

export async function getAdminCategories(): Promise<{
  data: AdminCategory[];
}> {
  return adminRequest<{
    data: AdminCategory[];
  }>("/admin/categories");
}

export async function getAdminCategory(
  id: string,
): Promise<{
  data: AdminCategory;
}> {
  return adminRequest<{
    data: AdminCategory;
  }>(
    `/admin/categories/${id}`,
  );
}

export async function createCategory(
  input: CreateCategoryInput,
): Promise<{
  data: AdminCategory;
}> {
  return adminRequest<{
    data: AdminCategory;
  }>("/admin/categories", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateCategory(
  id: string,
  input: UpdateCategoryInput,
): Promise<{
  data: AdminCategory;
}> {
  return adminRequest<{
    data: AdminCategory;
  }>(
    `/admin/categories/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function deleteCategory(
  id: string,
): Promise<{
  data: {
    success: boolean;
  };
}> {
  return adminRequest<{
    data: {
      success: boolean;
    };
  }>(
    `/admin/categories/${id}`,
    {
      method: "DELETE",
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Tags                                                                       */
/* -------------------------------------------------------------------------- */

export async function getAdminTags(): Promise<{
  data: AdminTag[];
}> {
  return adminRequest<{
    data: AdminTag[];
  }>("/admin/tags");
}