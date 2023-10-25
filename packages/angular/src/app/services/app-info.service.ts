import { Injectable } from '@angular/core';

@Injectable()
export class AppInfoService {
  constructor() {}

  public get title() {
    return '공동연구포털';
  }

  public get currentYear() {
    return new Date().getFullYear();
  }
}
