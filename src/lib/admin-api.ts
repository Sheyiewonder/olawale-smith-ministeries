const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4000/api";

/* -------------------------------------------------------------------------- */
/* Shared Types                                                               */
/* -------------------------------------------------------------------------- */

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface ApiSuccess {
  success: boolean;
}

/* -------------------------------------------------------------------------- */
/* Authentication / Admin                                                     */
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

export interface AdminResourceCategory {
  resourceId: string;
  categoryId: string;
  category: AdminCategory;
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
/* Tags                                                                       */
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

export interface AdminResourceTag {
  resourceId: string;
  tagId: string;
  tag: AdminTag;
}

export interface CreateTagInput {
  name: string;
  slug?: string;
}

export interface UpdateTagInput {
  name?: string;
  slug?: string;
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

export interface CreateMediaInput {
  type: MediaType;

  provider: MediaProvider;

  title?: string;

  url?: string;

  storageKey?: string;

  externalId?: string;

  mimeType?: string;

  fileSize?: number;

  duration?: number;
}

/* -------------------------------------------------------------------------- */
/* Series                                                                     */
/* -------------------------------------------------------------------------- */

export interface AdminSeries {
  id: string;
  title: string;
  slug: string;
  description?: string | null;

  createdAt?: string;
  updatedAt?: string;
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

  categories?: AdminResourceCategory[];

  tags?: AdminResourceTag[];

  series?: AdminSeries | null;

  createdAt: string;

  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/* Resource Inputs                                                            */
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

  media?: CreateMediaInput[];
}

/*
 * PATCH requests should be allowed to send only
 * the fields that actually changed.
 */
export type UpdateResourceInput =
  Partial<CreateResourceInput>;

/* -------------------------------------------------------------------------- */
/* API Response Types                                                         */
/* -------------------------------------------------------------------------- */

export interface ResourceResponse {
  data: AdminResource;
}

export interface ResourcesResponse {
  data: AdminResource[];
  meta?: ApiMeta;
}

export interface CategoryResponse {
  data: AdminCategory;
}

export interface CategoriesResponse {
  data: AdminCategory[];
  meta?: ApiMeta;
}

export interface TagResponse {
  data: AdminTag;
}

export interface TagsResponse {
  data: AdminTag[];
  meta?: ApiMeta;
}

export interface DeleteResponse {
  data: ApiSuccess;
}

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
): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    TOKEN_KEY,
    token,
  );
}

export function clearAdminToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
}

/* -------------------------------------------------------------------------- */
/* Request Helper                                                             */
/* -------------------------------------------------------------------------- */

export async function adminRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAdminToken();

  const headers = new Headers(
    options.headers,
  );

  /*
   * Only set JSON content type when
   * a request actually has a body.
   */
  if (options.body !== undefined) {
    headers.set(
      "Content-Type",
      "application/json",
    );
  }

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`,
    );
  }

  const url = `${API_URL}${path}`;

  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      headers,
      cache: "no-store",
    });
  } catch (error) {
    console.error(
      "Admin API request failed:",
      {
        url,
        method:
          options.method ?? "GET",
        error,
      },
    );

    throw new Error(
      "Unable to connect to the API server.",
    );
  }

  /*
   * Handle authentication failures centrally.
   *
   * We do not automatically redirect here because
   * this API helper can be used by pages that need
   * to decide how they want to handle authentication.
   */
  if (response.status === 401) {
    throw new Error(
      "Your session has expired. Please log in again.",
    );
  }

  if (!response.ok) {
    let message =
      `Request failed (${response.status})`;

    try {
      const body =
        await response.json();

      if (
        typeof body?.message ===
        "string"
      ) {
        message = body.message;
      } else if (
        typeof body?.error ===
        "string"
      ) {
        message = body.error;
      } else if (
        Array.isArray(body?.message)
      ) {
        message =
          body.message.join(", ");
      }
    } catch {
      /*
       * Ignore invalid/non-JSON error bodies.
       */
    }

    throw new Error(message);
  }

  /*
   * DELETE requests may return 204.
   */
  if (response.status === 204) {
    return undefined as T;
  }

  /*
   * Some successful requests may return
   * an empty body.
   */
  const contentType =
    response.headers.get(
      "content-type",
    );

  if (
    !contentType?.includes(
      "application/json",
    )
  ) {
    return undefined as T;
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

export async function getAdminResources(): Promise<ResourcesResponse> {
  return adminRequest<ResourcesResponse>(
    "/admin/resources",
  );
}

export async function getAdminResource(
  id: string,
): Promise<ResourceResponse> {
  return adminRequest<ResourceResponse>(
    `/admin/resources/${id}`,
  );
}

export async function createResource(
  input: CreateResourceInput,
): Promise<ResourceResponse> {
  return adminRequest<ResourceResponse>(
    "/admin/resources",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export async function updateResource(
  id: string,
  input: UpdateResourceInput,
): Promise<ResourceResponse> {
  return adminRequest<ResourceResponse>(
    `/admin/resources/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function deleteResource(
  id: string,
): Promise<DeleteResponse> {
  return adminRequest<DeleteResponse>(
    `/admin/resources/${id}`,
    {
      method: "DELETE",
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Categories                                                                 */
/* -------------------------------------------------------------------------- */

export async function getAdminCategories(): Promise<CategoriesResponse> {
  return adminRequest<CategoriesResponse>(
    "/admin/categories",
  );
}

export async function getAdminCategory(
  id: string,
): Promise<CategoryResponse> {
  return adminRequest<CategoryResponse>(
    `/admin/categories/${id}`,
  );
}

export async function createCategory(
  input: CreateCategoryInput,
): Promise<CategoryResponse> {
  return adminRequest<CategoryResponse>(
    "/admin/categories",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export async function updateCategory(
  id: string,
  input: UpdateCategoryInput,
): Promise<CategoryResponse> {
  return adminRequest<CategoryResponse>(
    `/admin/categories/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function deleteCategory(
  id: string,
): Promise<DeleteResponse> {
  return adminRequest<DeleteResponse>(
    `/admin/categories/${id}`,
    {
      method: "DELETE",
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Tags                                                                       */
/* -------------------------------------------------------------------------- */

export async function getAdminTags(): Promise<TagsResponse> {
  return adminRequest<TagsResponse>(
    "/admin/tags",
  );
}

export async function getAdminTag(
  id: string,
): Promise<TagResponse> {
  return adminRequest<TagResponse>(
    `/admin/tags/${id}`,
  );
}

export async function createTag(
  input: CreateTagInput,
): Promise<TagResponse> {
  return adminRequest<TagResponse>(
    "/admin/tags",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export async function updateTag(
  id: string,
  input: UpdateTagInput,
): Promise<TagResponse> {
  return adminRequest<TagResponse>(
    `/admin/tags/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function deleteTag(
  id: string,
): Promise<DeleteResponse> {
  return adminRequest<DeleteResponse>(
    `/admin/tags/${id}`,
    {
      method: "DELETE",
    },
  );
}