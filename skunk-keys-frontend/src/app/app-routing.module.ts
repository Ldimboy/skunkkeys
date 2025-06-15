import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingHomeComponent } from './pages/landing-home/landing-home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AllItemsComponent } from './pages/dashboard/all-items/all-items.component';
import { PasswordsComponent } from './pages/dashboard/passwords/passwords.component';
import { NotesComponent } from './pages/dashboard/notes/notes.component';
import { ProfileSettingsComponent } from './pages/dashboard/profile-settings/profile-settings.component';
import { AuthGuard } from './guards/auth.guard';
import { FoldersComponent } from './pages/dashboard/folders/folders.component';

import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { AdminLayoutComponent } from './pages/admin-layout/admin-layout.component';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', component: LandingHomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify', component: VerifyEmailComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },


  // Rutas dashboard protegidas
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'all-items', pathMatch: 'full' },
      { path: 'folders', component: FoldersComponent },
      { path: 'all-items', component: AllItemsComponent },
      { path: 'passwords', component: PasswordsComponent },
      { path: 'notes', component: NotesComponent },
      { path: 'profile', component: ProfileSettingsComponent },
    ]
  },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard,AdminGuard],
    children: [
      { path: '', component: AdminUsersComponent }
    ]
  }


];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
