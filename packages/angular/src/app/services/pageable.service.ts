import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import DevExpress from "devextreme";
import LoadOptions = DevExpress.data.LoadOptions;

export interface Pageable {
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  filter?: string;
}

export interface Page<T> {
  totalElements: number;
  content: T[];
}

@Injectable()
export class PageableService {

  constructor(private router: Router) { }

  /** DevExtreme Data Grid 의 LoadOptions 으로부터 JPA Pageable(Page+Sort) 파라미터를 생성한다. */
  getPageable(loadOptions: LoadOptions): Pageable {
    const size = loadOptions.take;
    const page = loadOptions.skip! / loadOptions.take!;
    const sorts = loadOptions.sort as Array<any>;

    const params = {page, size} as Pageable;

    if (sorts) {
      const sort = sorts.pop();
      const sortBy = sort.selector;
      const sortDir = sort.desc ? 'desc' : 'asc';

      params.sortBy = sortBy;
      params.sortDir = sortDir;
    }

    return params;
  }

  /** JPA Page 데이터를 DevExtreme Data Grid 의 Paging Data 포맷으로 변경한다.
   * 건수: totalElements => totalCount,
   * 목록데이터: content => data
   * @param page JPA Page */
  transformPage(page: Page<any>) {
    const dxPage = {
      totalCount: page.totalElements,
      data: page.content
    }
    return dxPage;
  }

}
