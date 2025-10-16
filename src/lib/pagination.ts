/**
 * Pagination Utilities
 * 
 * Provides cursor-based and offset-based pagination helpers for API endpoints.
 * Cursor-based pagination is more efficient for large datasets.
 */

import { z } from 'zod';

/**
 * Cursor-based pagination parameters schema
 */
export const cursorPaginationSchema = z.object({
  cursor: z.string().optional(), // ID of the last item from previous page
  limit: z.coerce.number().int().positive().max(100).default(20),
  direction: z.enum(['forward', 'backward']).default('forward'),
});

/**
 * Offset-based pagination parameters schema
 */
export const offsetPaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

/**
 * Cursor pagination types
 */
export type CursorPaginationParams = z.infer<typeof cursorPaginationSchema>;
export type OffsetPaginationParams = z.infer<typeof offsetPaginationSchema>;

export interface CursorPaginationResult<T> {
  data: T[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
    totalCount?: number;
  };
}

export interface OffsetPaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Build cursor-based pagination query for Prisma
 */
export function buildCursorQuery(params: CursorPaginationParams) {
  const { cursor, limit, direction } = params;
  
  const query: any = {
    take: direction === 'forward' ? limit + 1 : -(limit + 1), // Fetch one extra to check if there's more
  };

  if (cursor) {
    query.cursor = { id: cursor };
    query.skip = 1; // Skip the cursor itself
  }

  return query;
}

/**
 * Process cursor-based pagination results
 */
export function processCursorResults<T extends { id: string }>(
  items: T[],
  limit: number,
  direction: 'forward' | 'backward' = 'forward'
): CursorPaginationResult<T> {
  const hasMore = items.length > limit;
  const data = hasMore ? items.slice(0, limit) : items;

  const startCursor = data.length > 0 ? data[0].id : null;
  const endCursor = data.length > 0 ? data[data.length - 1].id : null;

  return {
    data,
    pageInfo: {
      hasNextPage: direction === 'forward' ? hasMore : false,
      hasPreviousPage: direction === 'backward' ? hasMore : false,
      startCursor,
      endCursor,
    },
  };
}

/**
 * Build offset-based pagination query for Prisma
 */
export function buildOffsetQuery(params: OffsetPaginationParams) {
  const { page, limit } = params;
  const skip = (page - 1) * limit;

  return {
    skip,
    take: limit,
  };
}

/**
 * Process offset-based pagination results
 */
export function processOffsetResults<T>(
  items: T[],
  total: number,
  params: OffsetPaginationParams
): OffsetPaginationResult<T> {
  const { page, limit } = params;
  const totalPages = Math.ceil(total / limit);

  return {
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

/**
 * Parse pagination parameters from URL search params
 */
export function parseCursorPagination(searchParams: URLSearchParams): CursorPaginationParams {
  return cursorPaginationSchema.parse({
    cursor: searchParams.get('cursor') || undefined,
    limit: searchParams.get('limit') || undefined,
    direction: searchParams.get('direction') || undefined,
  });
}

export function parseOffsetPagination(searchParams: URLSearchParams): OffsetPaginationParams {
  return offsetPaginationSchema.parse({
    page: searchParams.get('page') || undefined,
    limit: searchParams.get('limit') || undefined,
  });
}
