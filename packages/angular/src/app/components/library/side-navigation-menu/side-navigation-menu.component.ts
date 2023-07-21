import {
  Component,
  NgModule,
  Output,
  Input,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { DxTreeViewModule, DxTreeViewComponent, DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';
import * as events from 'devextreme/events';
import {Apollo, gql} from "apollo-angular";
import notify from "devextreme/ui/notify";

@Component({
  selector: 'side-navigation-menu',
  templateUrl: './side-navigation-menu.component.html',
  styleUrls: ['./side-navigation-menu.component.scss'],
})
export class SideNavigationMenuComponent implements AfterViewInit, OnDestroy {
  @ViewChild(DxTreeViewComponent, { static: true })
  menu!: DxTreeViewComponent;

  @Output()
  selectedItemChanged = new EventEmitter<DxTreeViewTypes.ItemClickEvent>();

  @Output()
  openMenu = new EventEmitter<any>();

  navigation: any[];

  private _selectedItem!: String;
  private _compactMode = false;

  constructor(private elementRef: ElementRef, private apollo: Apollo) {
    this.apollo.query({
      query: gql`
        query menuList($name: String) {
          menuList(name: $name) {
            id
            name
            parentId
            path
            type
            icon
            expanded
          }
        }
      `,
      variables: {
        name: ''
      }
    }).subscribe({
      next: (result: any) => {
        this.navigation = result.data.menuList;
      },
      error: (e) => {
        console.error(e);
        notify('오류가 발생하였습니다.', 'error', 3000);
      }
    });
  }

  @Input()
  get compactMode() {
    return this._compactMode;
  }

  @Input()
  set selectedItem(value: String) {
    this._selectedItem = value;
    this.setSelectedItem();
  }

  get selectedItem(): String {
    return this._selectedItem;
  }

  set compactMode(val) {
    this._compactMode = val;

    if (!this.menu.instance) {
      return;
    }

    if (val) {
      this.menu.instance.collapseAll();
    } else {
      this.menu.instance.expandItem(this._selectedItem);
    }
  }

  setSelectedItem() {
    if (!this.menu.instance) {
      return;
    }

    this.menu.instance.selectItem(this.selectedItem);
  }

  onItemClick(event: DxTreeViewTypes.ItemClickEvent) {
    this.selectedItemChanged.emit(event);
  }

  ngAfterViewInit() {
    this.setSelectedItem();
    events.on(this.elementRef.nativeElement, 'dxclick', (e: Event) => {
      this.openMenu.next(e);
    });
  }

  ngOnDestroy() {
    events.off(this.elementRef.nativeElement, 'dxclick');
  }
}

@NgModule({
  imports: [DxTreeViewModule],
  declarations: [SideNavigationMenuComponent],
  exports: [SideNavigationMenuComponent],
})
export class SideNavigationMenuModule { }
