import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddToListComponent } from './add-to-list/add-to-list.component';
import { UpdateComponent } from './update/update.component';
import { StartPageComponent } from './start-page/start-page.component';
import { AddPersonComponent } from './add-person/add-person.component';

export const routes: Routes = [
    { path: 'logout', component: HomeComponent },
    { path: 'addToList', component: AddToListComponent },
    { path: 'update/:listItemId', component: UpdateComponent },
    { path: '', component: StartPageComponent },
    { path: 'deploy', component: HomeComponent },
    { path: 'deposit', component: HomeComponent },
    { path: 'addPerson', component: AddPersonComponent }
];
