import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dataprotection',
  templateUrl: './dataprotection.component.html',
  styleUrls: ['./dataprotection.component.scss']
})
export class DataprotectionComponent {

  
  constructor(private router: Router){}


  goToLoginPage() {
    this.router.navigateByUrl('');
  }

}
