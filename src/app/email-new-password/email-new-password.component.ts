import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-email-new-password',
  templateUrl: './email-new-password.component.html',
  styleUrls: ['./email-new-password.component.scss']
})
export class EmailNewPasswordComponent {


  constructor(private authService: AuthService){}



}
