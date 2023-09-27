import { Component, NgModule, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DxDropDownButtonModule } from 'devextreme-angular/ui/drop-down-button';
import { UserMenuSectionModule, UserMenuSectionComponent } from '../user-menu-section/user-menu-section.component';
import { IUser } from '../../../services/auth.service';
@Component({
  selector: 'user-panel',
  templateUrl: 'user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
})

export class UserPanelComponent {

  @Input()
  menuMode!: string;
  user: any;
  menuItems: any;

  @Input() set selectUser(user) {
    this.user = user;
  };

  @Input() set selectMenuItems(userMenuItems) {
    this.menuItems = userMenuItems
  };

  @ViewChild(UserMenuSectionComponent) userMenuSection: UserMenuSectionComponent;

  constructor() {}

  handleDropDownButtonContentReady({ component }) {
    component.registerKeyHandler('downArrow', () => {
      this.userMenuSection.userInfoList.nativeElement.focus();
    });
  }
}

@NgModule({
  imports: [
    DxDropDownButtonModule,
    UserMenuSectionModule,
    CommonModule,
  ],
  declarations: [UserPanelComponent],
  exports: [UserPanelComponent],
})
export class UserPanelModule { }
