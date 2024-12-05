import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MsalService } from "@azure/msal-angular";
import { AccountInfo } from "@azure/msal-browser";
import { BehaviorSubject } from "rxjs";
import { BACKEND_URL, MANUFACTURER_COLUMN_ID, STATE_COLUMN_ID, TYPE_COLUMN_ID } from "../choiceURLS";
import { toolItem } from "src/backend/interfaces/listItem.interface";
import { response } from "express";
import { FrontendService } from "./frontend.service";

@Injectable({
    providedIn: 'root',
})
export class UserService {

    constructor(private msalService: MsalService, private http: HttpClient, private frontendService: FrontendService) { }

    users: any[] = [];
    nextUserId: any = "1";
    updatePerson: any;

    // usereket figyeli
    private userSubject = new BehaviorSubject<any[]>([]);
    users$ = this.userSubject.asObservable();

    updateUsers(newUsers: any[]): void {
        this.userSubject.next(newUsers);
    }

    // current usert keres
    private updatePersonSubject = new BehaviorSubject<any[]>([]);
    updatePerson$ = this.updatePersonSubject.asObservable();

    updateCurrentUser(newUser: any): void {
        this.updatePersonSubject.next(newUser);
    }

    async getUsers() {

        const account = this.msalService.instance.getAllAccounts()[0];

        if (account) {

            try {

                const token = await this.frontendService.aqueireTokenSilently(account);

                const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
                this.http.get(`${BACKEND_URL}/get-users`, { headers }).subscribe(
                    (data: any) => {
                        this.users = data.value;
                        this.updateUsers(this.users);
                        console.log("users: ",this.users);
                    },
                    (error) => {
                        console.error('error getting users:', error);
                    }
                );
            } catch (error) {
                console.error('token error:', error);
            }
        }

    }

    async getPersonById(personId: string) {

        const account = this.msalService.instance.getAllAccounts()[0];

        if (account) {

            const token = await this.frontendService.aqueireTokenSilently(account);

            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

            this.http.get(`${BACKEND_URL}/getPerson/${personId}`, { headers }).subscribe(
                (data: any) => {
                    this.updatePerson = data.value;
                    this.updateCurrentUser(this.updatePerson);
                    console.log("updateperson: ", this.updatePerson)
                },
                (error) => {
                    console.error('error getting id-ed person:', error);
                }
            );
        }
    }

    async addPersonToList(person: any) {

        const account = this.msalService.instance.getAllAccounts()[0];

        if (account) {

            const token = await this.frontendService.aqueireTokenSilently(account);

            person.id = String(this.getNextId());
            console.log("person id: ", person.id);

            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            this.http.post(`${BACKEND_URL}/add-person`, person, { headers }).subscribe();

        }

    }

    getNextId(): Promise<string> {
        var startId = 0;
        for (let index = 0; index < this.users.length; index++) {
            const currentItemId = Number(this.users[index].fields.Title);
            if (currentItemId > startId) {
                this.nextUserId = currentItemId + 1;
                startId = currentItemId;
            }

        }

        return this.nextUserId;
    }

}