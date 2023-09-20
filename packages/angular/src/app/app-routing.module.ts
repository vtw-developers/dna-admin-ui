import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {
  ChangePasswordFormComponent,
  CreateAccountFormComponent,
  LoginFormComponent,
  ResetPasswordFormComponent,
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
import {FlowSchedulerComponent} from "./pages/dna/flow-scheduler/flow-scheduler.component";
import {ServerMonitoringComponent} from "./pages/dna/ops/server/monitoring/server-monitoring.component";
import {DeployedFlowMonitoringComponent} from "./pages/dna/ops/deployed-flow/monitoring/deployed-flow-monitoring.component";
import {RoleComponent} from "./pages/role/role.component";
import {RoleGroupComponent} from "./pages/role/role-group.component";
import {AuthorityComponent} from "./pages/authority/authority.component";
import {ServerListComponent} from "./pages/dna/ops/server/list/server-list.component";
import {ApplicationMonitoringComponent} from "./pages/dna/ops/application/monitoring/application-monitoring.component";
import {UsersComponent} from "./pages/user/users.component";
import {OperationTreeComponent} from "./pages/dna/ops/operation-tree.component";
import {MenuComponent} from "./pages/menu/menu.component";
import {RoleMenuComponent} from "./pages/role-menu/role-menu.component";
import {FlowHistoryComponent} from "./pages/dna/flow-history/flow-history.component";
import {DownloadIdeComponent} from "./pages/dna/download-ide/download-ide.component";
import {BlocklyComponent} from "./pages/blockly/blockly.component";
import {BlocklyListComponent} from "./pages/blockly/blockly-list.component";

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
        path: 'flow-history',
        component: FlowHistoryComponent,
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
        path: 'role',
        component: RoleComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'role-group',
        component: RoleGroupComponent,
        canActivate: [AuthGuardService],
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
        path: 'server-list',
        component: ServerListComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'operation-tree',
        component: OperationTreeComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'server-monitoring',
        component: ServerMonitoringComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'application-monitoring',
        component: ApplicationMonitoringComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'flow-monitoring',
        component: DeployedFlowMonitoringComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'menu',
        component: MenuComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'role-menu',
        component: RoleMenuComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'download-ide',
        component: DownloadIdeComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'blockly',
        component: BlocklyComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'blockly-list',
        component: BlocklyListComponent,
        canActivate: [AuthGuardService]
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
