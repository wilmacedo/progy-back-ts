import { Request } from 'express';

interface SelectParams {
  [key: string]: boolean;
}

interface IncludeParams {
  [key: string]: {
    select: SelectParams;
  };
}

interface PaginationParams {
  take: number;
  skip: number;
}

export interface FilterParams {
  [key: string]: string | number | { [key: string]: number[] };
}

interface Options {
  include?: IncludeParams;
  take?: number;
  skip?: number;
  where?: FilterParams;
}

export default class QueryManager {
  private request: Request;

  constructor(request: Request) {
    this.request = request;
  }

  populate(fields?: string[]): IncludeParams {
    const { populate } = this.request.query;
    if (!populate) {
      return {} as IncludeParams;
    }

    const toPopulate: string[] = (populate as string).split(',');
    const include: IncludeParams = {};
    toPopulate.forEach(field => {
      if (field === 'responsible') field = 'Responsible';

      if (field.length === 0) return;

      if (fields) {
        const select: SelectParams = {};
        fields.forEach(f => {
          select[f] = true;
        });

        include[field] = { select };
      } else {
        include[field] = { select: { id: true, name: true } };
      }
    });

    return include;
  }

  pagination(): PaginationParams {
    const { pagination } = this.request.query;
    if (!pagination) {
      return {} as PaginationParams;
    }

    try {
      const { perPage, page } = JSON.parse(pagination as string);

      let take = 6;
      if (!isNaN(perPage)) {
        take = parseInt(perPage);
      }

      let skip = 0;
      if (!isNaN(page)) {
        skip = take * parseInt(page);
      }

      return { take, skip };
    } catch (e) {
      console.error('Error on parse pagination', e);
    }

    return {} as PaginationParams;
  }

  filter() {
    const { filter } = this.request.query;
    if (!filter) {
      return {};
    }

    try {
      const parsedFilter = JSON.parse(filter as string);
      if (typeof parsedFilter !== 'object') return {};

      let result = {};

      Object.keys(parsedFilter).forEach(key => {
        if (Array.isArray(parsedFilter[key])) {
          result = { ...result, [key]: { in: [...parsedFilter[key]] } };
          return;
        }

        result = { ...result, [key]: parsedFilter[key] };
      });

      return result;
    } catch (e) {
      console.error('Error on parse filter', e);
    }
  }

  totalPages(total: number) {
    const { pagination } = this.request.query;
    if (!pagination) return;

    if (total < 0) return;

    try {
      const { perPage } = JSON.parse(pagination as string);

      return Math.floor(total / perPage);
    } catch (e) {
      console.error('Error on parse pagination', e);
    }
  }

  build(filter?: FilterParams): Options {
    const options: Options = {};

    const include = this.populate();
    if (Object.keys(include).length > 0) {
      options.include = include;
    }

    const pagination = this.pagination();
    if (Object.keys(pagination).length > 0) {
      options.skip = pagination.skip;
      options.take = pagination.take;
    }

    const requestFilter = this.filter();
    if (requestFilter && Object.keys(requestFilter).length > 0) {
      options.where = requestFilter;
    }

    if (filter) {
      if (options.where) {
        options.where = { ...options.where, ...filter };
      } else {
        options.where = filter;
      }
    }

    return options;
  }
}
