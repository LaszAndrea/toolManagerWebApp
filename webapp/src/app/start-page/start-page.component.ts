import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-page',
  imports: [CommonModule],
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.css'
})
export class StartPageComponent {

  constructor(private router: Router){}

  goToDeployedPage(){
    this.router.navigate(['/deploy']);
  }

  goToDepositPage(){
    this.router.navigate(['/deposit']);
  }

}
