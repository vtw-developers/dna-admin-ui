import { Injectable } from '@angular/core';

export interface Menu {
  id: number;
  name: string;
  detail: string;
  parentId: string;
  path: string;
  type: string;
  icon: string;
  expanded: Boolean;
}

const types: string[] = [
  'Template',
  'Group'
];

@Injectable()
export class Service {
  getTypes(): string[] {
    return types;
  }
}
