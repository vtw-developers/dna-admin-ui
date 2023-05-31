import {Component, HostBinding, OnDestroy,} from '@angular/core';
import {AppInfoService, AuthService, ScreenService, ThemeService} from './services';
// @ts-ignore
import dxKo from './languages/ko/dx-ko.json';
import {loadMessages, locale} from 'devextreme/localization';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {

  @HostBinding('class') get getClass() {
    return Object.keys(this.screen.sizes).filter((cl) => this.screen.sizes[cl]).join(' ');
  }

  constructor(private authService: AuthService,
              private themeService: ThemeService,
              private screen: ScreenService,
              public appInfo: AppInfoService) {
    themeService.setAppTheme();

    loadMessages(dxKo);
    loadMessages({
      'en': {
        'Yes': 'OK',
        'No': 'Cancel',
        'Edit': 'Cancel',
      }
    });
    locale(navigator.language);
  }

  isAuthenticated() {
    return this.authService.loggedIn;
  }

  ngOnDestroy(): void {
    this.screen.breakpointSubscription.unsubscribe();
  }

  getLocale() {
    const locale = sessionStorage.getItem('locale');
    return locale != null ? locale : 'ko';
  }
}
