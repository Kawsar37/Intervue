export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export const getPaginationParams = (
  page?: string,
  limit?: string
): PaginationParams => {
  const pageNum = Math.max(1, parseInt(page || "1", 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit || "10", 10)));
  const skip = (pageNum - 1) * limitNum;

  return {
    page: pageNum,
    limit: limitNum,
    skip,
  };
};

export const getPaginationMeta = (
  total: number,
  page: number,
  limit: number
): PaginationMeta => {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  };
};
