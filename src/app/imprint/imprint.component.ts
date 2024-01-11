import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-imprint',
  templateUrl: './imprint.component.html',
  styleUrls: ['./imprint.component.scss']
})
export class ImprintComponent {

constructor(private router: Router){}

  goToLoginPage() {
    this.router.navigateByUrl('');
  }

}
