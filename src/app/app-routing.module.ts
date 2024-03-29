import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainboardComponent } from './mainboard/mainboard.component';
import { SignupComponent } from './signup/signup.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ImprintComponent } from './imprint/imprint.component';
import { DataprotectionComponent } from './dataprotection/dataprotection.component';
import { ThreadComponent } from './mainboard-components/thread/thread.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'mainboard/:ref', component: MainboardComponent},
  {path: 'signUp', component: SignupComponent},
  {path: 'passwordReset', component: PasswordResetComponent},
  {path: 'imprint', component: ImprintComponent},
  {path: 'dataProtection', component: DataprotectionComponent},
  {path: 'thread', component: ThreadComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
