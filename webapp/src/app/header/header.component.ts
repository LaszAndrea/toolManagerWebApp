import { Component, inject } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { HttpClient } from '@angular/common/http';
import { MsalService } from '@azure/msal-angular';
import { CommonModule } from '@angular/common';
import { FrontendService } from '../frontend_service/frontend.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, SearchComponent, RouterModule],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  msalService = inject(MsalService);
  http = inject(HttpClient);
  items: any[] = [];

  constructor(private frontendService: FrontendService, private router: Router){}

  async login() {
    this.msalService.instance
      .loginRedirect({
        scopes: ['https://graph.microsoft.com/.default'],
        redirectUri: 'http://localhost:4200',
      })
      .catch((error) => console.error('Login error:', error));
  }

  async logout() {

    await this.msalService.instance.initialize();

    this.msalService.instance.logoutRedirect({
      postLogoutRedirectUri: 'http://localhost:4200/logout',
    }).catch(error => {
      console.error('logout error:', error);
    });
  }

  async getSearchedItems(term: string){
    this.frontendService.getSearchedItems(term, this.router.url);
    this.frontendService.items$.subscribe((newItems) => {
      this.items = newItems;
    });
  }


}
