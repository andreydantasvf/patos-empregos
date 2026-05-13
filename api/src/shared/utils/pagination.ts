import type { Request } from 'express';
import type { PaginationMeta } from './response';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export function parsePagination(req: Request): PaginationParams {
  const page = Math.max(1, parseInt((req.query.page as string) ?? '1') || 1);
  const limit = Math.min(100, Math.max(1, parseInt((req.query.limit as string) ?? '10') || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildMeta(total: number, page: number, limit: number): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
