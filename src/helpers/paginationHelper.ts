type IOptions = {
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: string;
};

export const calculatePagination = (options: IOptions) => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 10;
  const skip: number = (page - 1) * limit;

  const sortBy: string = options.sortBy || "createdAt";
  const sortOrder: string = options.sortBy || "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};
