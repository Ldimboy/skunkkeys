import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';

// Formularios
import { FormsModule } from '@angular/forms';
import { LandingHomeComponent } from './pages/landing-home/landing-home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { AllItemsComponent } from './pages/dashboard/all-items/all-items.component';
import { PasswordsComponent } from './pages/dashboard/passwords/passwords.component';
import { NotesComponent } from './pages/dashboard/notes/notes.component';
import { ProfileSettingsComponent } from './pages/dashboard/profile-settings/profile-settings.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NoteFormComponent } from './shared/forms/note-form/note-form.component';
import { PasswordFormComponent } from './shared/forms/password-form/password-form.component';
import { FoldersComponent } from './pages/dashboard/folders/folders.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { AdminLayoutComponent } from './pages/admin-layout/admin-layout.component';



@NgModule({
  declarations: [
    AppComponent,
    LandingHomeComponent,
    LoginComponent,
    RegisterComponent,
    VerifyEmailComponent,
    DashboardComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AllItemsComponent,
    PasswordsComponent,
    NotesComponent,
    ProfileSettingsComponent,
    TopbarComponent,
    SidebarComponent,
    NoteFormComponent,
    PasswordFormComponent,
    FoldersComponent,
    AdminUsersComponent,
    AdminLayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FormsModule

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
