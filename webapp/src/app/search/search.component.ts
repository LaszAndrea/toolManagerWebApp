import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from '../home/home.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  searched = '';
  @Output() searchEvent = new EventEmitter<string>();

  constructor(private homecomponent: HomeComponent, private router: Router){  }

  search(term: string): void{
    this.searched = term;

    if(term){
      this.searchEvent.emit(this.searched);
    }
    else if(term == "" || term == null)
      if(this.router.url == "/deploy"){
        this.homecomponent.getDeployedItems();
      }else if(this.router.url == "/deposit"){
        this.homecomponent.getDepositedItems();
      }
  }

}
