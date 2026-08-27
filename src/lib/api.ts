const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4000/api";

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

/* -------------------------------------------------------------------------- */
/* Supporting Types                                                           */
/* -------------------------------------------------------------------------- */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Series {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
}

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

export interface MediaAsset {
  id: string;

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

export interface Resource {
  id: string;

  title: string;
  slug: string;
  description?: string | null;

  type: ResourceType;

  speaker?: string | null;
  duration?: number | null;

  featured: boolean;
  published: boolean;

  publishedAt?: string | null;

  thumbnailId?: string | null;
  seriesId?: string | null;

  media: MediaAsset[];

  thumbnail?: MediaAsset | null;

  categories: {
    resourceId: string;
    categoryId: string;
    category: Category;
  }[];

  tags: {
    resourceId: string;
    tagId: string;
    tag: Tag;
  }[];

  series?: Series | null;
}

/* -------------------------------------------------------------------------- */
/* API Response                                                               */
/* -------------------------------------------------------------------------- */

export interface ResourcesMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ResourcesResponse {
  data: Resource[];
  meta: ResourcesMeta;
}

/* -------------------------------------------------------------------------- */
/* Resource Queries                                                           */
/* -------------------------------------------------------------------------- */

export interface ResourceQuery {
  page?: number;
  limit?: number;

  type?: ResourceType;

  category?: string;

  featured?: boolean;

  search?: string;
}

/* -------------------------------------------------------------------------- */
/* Get Categories                                                             */
/* -------------------------------------------------------------------------- */

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(
    `${API_URL}/categories`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch categories (${response.status})`,
    );
  }

  const result: {
    data: Category[];
  } = await response.json();

  return result.data;
}

/* -------------------------------------------------------------------------- */
/* Get Resources                                                              */
/* -------------------------------------------------------------------------- */

export async function getResources(
  query: ResourceQuery = {},
): Promise<ResourcesResponse> {
  const params = new URLSearchParams();

  if (query.page !== undefined) {
    params.set("page", String(query.page));
  }

  if (query.limit !== undefined) {
    params.set("limit", String(query.limit));
  }

  if (query.type) {
    params.set("type", query.type);
  }

  /*
   * Normalize category.
   *
   * Empty or whitespace-only categories are ignored.
   */
  const category = query.category?.trim();

  if (category) {
    params.set("category", category);
  }

  if (query.featured !== undefined) {
    params.set(
      "featured",
      String(query.featured),
    );
  }

  /*
   * Normalize search.
   *
   * This prevents values such as "   " from becoming
   * unnecessary search parameters.
   *
   * Example:
   * "   faith   " → "faith"
   * "      "      → no search parameter
   */
  const search = query.search?.trim();

  if (search) {
    params.set("search", search);
  }

  const queryString = params.toString();

  const url = `${API_URL}/resources${
    queryString ? `?${queryString}` : ""
  }`;

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch resources (${response.status})`,
    );
  }

  return response.json();
}

/* -------------------------------------------------------------------------- */
/* Get Single Resource                                                        */
/* -------------------------------------------------------------------------- */

export async function getResourceBySlug(
  slug: string,
): Promise<Resource> {
  const normalizedSlug = slug.trim();

  if (!normalizedSlug) {
    throw new Error("Resource slug is required");
  }

  const response = await fetch(
    `${API_URL}/resources/${encodeURIComponent(
      normalizedSlug,
    )}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Resource not found");
    }

    throw new Error(
      `Failed to fetch resource (${response.status})`,
    );
  }

  const result: { data: Resource } =
    await response.json();

  return result.data;
}

/* -------------------------------------------------------------------------- */
/* Convenience Helpers                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Fetch published articles.
 *
 * Articles are Resource records with:
 *
 * type === "ARTICLE"
 */
export async function getArticles(
  query: Omit<ResourceQuery, "type"> = {},
): Promise<ResourcesResponse> {
  return getResources({
    ...query,
    type: "ARTICLE",
  });
}

/**
 * Fetch the latest published articles.
 */
export async function getLatestArticles(
  limit = 3,
): Promise<Resource[]> {
  const safeLimit = Math.min(
    Math.max(1, limit),
    50,
  );

  const response = await getArticles({
    limit: safeLimit,
  });

  return response.data;
}
