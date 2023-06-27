import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {
  LoginFormComponent,
  ResetPasswordFormComponent,
  CreateAccountFormComponent,
  ChangePasswordFormComponent,
} from './components';
import {AuthGuardService} from './services';

import {SideNavOuterToolbarComponent, UnauthenticatedContentComponent} from './layouts';

import {CrmContactListComponent} from './pages/crm-contact-list/crm-contact-list.component';
import {CrmContactDetailsComponent} from './pages/crm-contact-details/crm-contact-details.component';
import {PlanningTaskListComponent} from './pages/planning-task-list/planning-task-list.component';
import {PlanningTaskDetailsComponent} from './pages/planning-task-details/planning-task-details.component';
import {AnalyticsDashboardComponent} from './pages/analytics-dashboard/analytics-dashboard.component';
import {AnalyticsSalesReportComponent} from './pages/analytics-sales-report/analytics-sales-report.component';
import {AnalyticsGeographyComponent} from './pages/analytics-geography/analytics-geography.component';
import {PlanningSchedulerComponent} from './pages/planning-scheduler/planning-scheduler.component';
import {AppSignInComponent} from './pages/sign-in-form/sign-in-form.component';
import {AppSignUpComponent} from './pages/sign-up-form/sign-up-form.component';
import {AppResetPasswordComponent} from './pages/reset-password-form/reset-password-form.component';
import {UserProfileComponent} from './pages/user-profile/user-profile.component';
import {ExtractListComponent} from './pages/dna/extract-list/extract-list.component';
import {ExtractDetailsComponent} from './pages/dna/extract-details/extract-details.component';
import {SwaggerComponent} from './pages/dna/swagger/swagger.component';
import {FlowTemplateListComponent} from './pages/dna/flow-template-list/flow-template-list.component';
import {FlowTreeComponent} from './pages/dna/flow-tree/flow-tree.component';
import {AuthorityComponent} from "./pages/authority/authority.component";
import {UsersComponent} from "./pages/users/users.component";
import {FlowSchedulerComponent} from "./pages/dna/flow-scheduler/flow-scheduler.component";


const routes: Routes = [
  {
    path: 'auth',
    component: UnauthenticatedContentComponent,
    children: [
      {
        path: 'login',
        component: LoginFormComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'reset-password',
        component: ResetPasswordFormComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'create-account',
        component: CreateAccountFormComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'change-password/:recoveryCode',
        component: ChangePasswordFormComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ]
  },
  {
    path: '',
    component: SideNavOuterToolbarComponent,
    children: [
      {
        path: 'flow-tree',
        component: FlowTreeComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'flow-scheduler',
        component: FlowSchedulerComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'flow-template-list',
        component: FlowTemplateListComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'swagger',
        component: SwaggerComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'extract-list',
        component: ExtractListComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'extract-details',
        component: ExtractDetailsComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'crm-contact-details2',
        component: CrmContactDetailsComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'crm-contact-list',
        component: CrmContactListComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'crm-contact-details',
        component: CrmContactDetailsComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'planning-task-list',
        component: PlanningTaskListComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'planning-task-details',
        component: PlanningTaskDetailsComponent
      },
      {
        path: 'planning-scheduler',
        component: PlanningSchedulerComponent
      },
      {
        path: 'analytics-dashboard',
        component: AnalyticsDashboardComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'analytics-sales-report',
        component: AnalyticsSalesReportComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'analytics-geography',
        component: AnalyticsGeographyComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'sign-in-form',
        component: AppSignInComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'sign-up-form',
        component: AppSignUpComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'reset-password-form',
        component: AppResetPasswordComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'user-profile',
        component: UserProfileComponent
      },
      {
        path: 'authority',
        component: AuthorityComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: '**',
        redirectTo: 'crm-contact-list',
        pathMatch: 'full',
      },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: true,}),
    BrowserModule,
  ],
  providers: [AuthGuardService],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {
}
