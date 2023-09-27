import { Component, NgModule, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DxListModule } from 'devextreme-angular/ui/list';

@Component({
  selector: 'user-menu-section',
  templateUrl: 'user-menu-section.component.html',
  styleUrls: ['./user-menu-section.component.scss'],
})

export class UserMenuSectionComponent {

  @Input()
  showAvatar!: boolean;
  user: any;
  username: any;
  menuItems: any;

  @Input() set selectUser(user) {
    this.user = user;
  };

  @Input() set selectMenuItems(userMenuItems) {
    this.menuItems = userMenuItems
  };

  @ViewChild('userInfoList', { read: ElementRef }) userInfoList: ElementRef<HTMLElement>;

  constructor() { }

  ngAfterViewInit(){
    this.username = JSON.parse(this.user).username;
  }

  handleListItemClick({ itemData }) {
    itemData.onClick();
  }
}

@NgModule({
  imports: [
    DxListModule,
    CommonModule,
  ],
  declarations: [UserMenuSectionComponent],
  exports: [UserMenuSectionComponent],
})
export class UserMenuSectionModule { }
