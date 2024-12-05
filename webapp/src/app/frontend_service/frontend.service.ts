import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MsalService } from "@azure/msal-angular";
import { AccountInfo } from "@azure/msal-browser";
import { BehaviorSubject } from "rxjs";
import { BACKEND_URL, MANUFACTURER_COLUMN_ID, STATE_COLUMN_ID, TYPE_COLUMN_ID } from "../choiceURLS";
import { toolItem } from "src/backend/interfaces/listItem.interface";
import { response } from "express";

@Injectable({
    providedIn: 'root',
})
export class FrontendService {

    constructor(private msalService: MsalService, private http: HttpClient) { }
    items: any[] = [];
    choices: any[] = [];
    nextId: any = "";
    gotItem: any;
    allOtherItems: any[] = [];
    availableItems: any[] = [];
    toolItem: toolItem = {
        id: "",
        state: "",
        manufacturer: "",
        model: "",
        type: "",
        serialNumber: "",
        dateOfPurchase: "",
        price: 0,
        photoURL: ""
    };

    private itemsSubject = new BehaviorSubject<any[]>([]);
    items$ = this.itemsSubject.asObservable();

    private gotItemSubject = new BehaviorSubject<any[]>([]);
    gotItem$ = this.gotItemSubject.asObservable();

    private allOtherItemsSubject = new BehaviorSubject<any[]>([]);
    allOtherItems$ = this.allOtherItemsSubject.asObservable();

    private availableItemsSubject = new BehaviorSubject<any[]>([]);
    availableItems$ = this.availableItemsSubject.asObservable();

    private stateChoicesSubject = new BehaviorSubject<any[]>([]);
    stateChoices$ = this.stateChoicesSubject.asObservable();

    private manufacturerChoicesSubject = new BehaviorSubject<any[]>([]);
    manufacturerChoices$ = this.manufacturerChoicesSubject.asObservable();

    private typeChoicesSubject = new BehaviorSubject<any[]>([]);
    typeChoices$ = this.typeChoicesSubject.asObservable();

    updateItems(newItems: any[]): void {
        this.itemsSubject.next(newItems);
    }

    updateCurrentItem(newItem: any): void {
        this.gotItemSubject.next(newItem);
    }

    updateAllOtherItems(newItem: any[]): void {
        this.allOtherItemsSubject.next(newItem);
    }

    updateAvailableItems(newItem: any[]): void {
        this.availableItemsSubject.next(newItem);
    }

    updateStates(newStateChoices: any[]): void {
        this.stateChoicesSubject.next(newStateChoices);
    }

    updateManufacturers(newManufacturerChoices: any[]): void {
        this.manufacturerChoicesSubject.next(newManufacturerChoices);
    }

    updateTypes(newTypeChoices: any[]): void {
        this.typeChoicesSubject.next(newTypeChoices);
    }

    async aqueireTokenSilently(account: AccountInfo) {
        const token = await this.msalService.instance.acquireTokenSilent({
            account,
            scopes: ['https://graph.microsoft.com/.default'],
        });

        return token.accessToken
    }

    async initializeMsal() {
        try {

            await this.msalService.instance.initialize();

        } catch (error) {
            console.error('MSAL Initialization Error:', error);
        }
    }

    async getListItems() {

        const account = this.msalService.instance.getAllAccounts()[0];

        if (account) {

            try {

                const token = await this.aqueireTokenSilently(account);

                const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
                this.http.get(`${BACKEND_URL}`, { headers }).subscribe(
                    (data: any) => {
                        this.items = data.value;
                        this.updateItems(this.items);
                    },
                    (error) => {
                        console.error('error getting list:', error);
                    }
                );
            } catch (error) {
                console.error('token error:', error);
            }
        }
    }

    async getSearchedItems(searched: string, url: string) {

        const account = this.msalService.instance.getAllAccounts()[0];

        if (account) {

            const token = await this.aqueireTokenSilently(account);

            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            this.http.get(`${BACKEND_URL}/search?q=${searched}&url=${url}`, { headers }).subscribe(
                (data: any) => {
                    this.items = data.value;
                    this.updateItems(this.items);
                    if(url == "/deploy"){
                        this.updateAllOtherItems(this.items);
                    }else if(url == "/deposit"){
                        this.updateAvailableItems(this.items);
                    }
                },
                (error) => {
                    console.error('error getting searched items:', error);
                }
            );

        }

    }

    async updateItem(itemId: string, itemToBeUpdated: any) {

        const account = this.msalService.instance.getAllAccounts()[0];

        if (account) {

            const token = await this.aqueireTokenSilently(account);

            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            this.http.put(`${BACKEND_URL}/update/${itemId}`, itemToBeUpdated, { headers }).subscribe({});

        }

    }

    async getItemById(itemId: string) {

        const account = this.msalService.instance.getAllAccounts()[0];

        if (account) {

            const token = await this.aqueireTokenSilently(account);

            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

            this.http.get(`${BACKEND_URL}/getItem/${itemId}`, { headers }).subscribe(
                (data: any) => {
                    this.gotItem = data.value;
                    this.updateCurrentItem(this.gotItem);
                },
                (error) => {
                    console.error('error getting id-ed items:', error);
                }
            );
        }
    }

    async addItemsToList(item: any) {

        const account = this.msalService.instance.getAllAccounts()[0];

        if (account) {

            const token = await this.aqueireTokenSilently(account);

            item.id = String(this.getNextId());

            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            this.http.post(`${BACKEND_URL}/add-item`, item, { headers }).subscribe();

        }

    }

    async deleteItem(deletingItemId: string) {
        const account = this.msalService.instance.getAllAccounts()[0];

        if (account) {

            const token = await this.aqueireTokenSilently(account);

            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            this.http.delete(`${BACKEND_URL}/deleteItem/${deletingItemId}`, { headers }).subscribe({});

        }
    }

    async getAvailableItems() {
        const account = this.msalService.instance.getAllAccounts()[0];

        if (account) {
            const token = await this.aqueireTokenSilently(account);
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            this.http.get(`${BACKEND_URL}/get-available-items`, { headers }).subscribe(
                (data: any) => {
                    this.availableItems = data.value;
                    this.updateAvailableItems(this.availableItems);
                },
                (error) => {
                    console.error('error getting available items:', error);
                }
            );

        }
    }

    async getAllOtherItem() {
        const account = this.msalService.instance.getAllAccounts()[0];

        if (account) {
            const token = await this.aqueireTokenSilently(account);
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            this.http.get(`${BACKEND_URL}/get-other-items`, { headers }).subscribe(
                (data: any) => {
                    this.allOtherItems = data.value;
                    this.updateAllOtherItems(this.allOtherItems);
                },
                (error) => {
                    console.error('error getting all other items:', error);
                }
            );



        }
    }

    async modifyStatusOfItem(itemId: string){

        const account = this.msalService.instance.getAllAccounts()[0];

        if (account) {

            const token = await this.aqueireTokenSilently(account);
            await this.getItemById(itemId);

            this.gotItem$.subscribe((item) => {
                if(item.length > 0){

                    console.log("item: ", item[0])

                    this.toolItem.id = item[0].fields.Title;
                    this.toolItem.manufacturer = item[0].fields.Manufacturer;
                    this.toolItem.dateOfPurchase = item[0].fields.PurchaseDate;
                    this.toolItem.model = item[0].fields.Model;
                    this.toolItem.photoURL = item[0].fields.photoURL;
                    this.toolItem.price = item[0].fields.PurchasePrice;
                    this.toolItem.serialNumber = item[0].fields.SerialNumber;
                    this.toolItem.state = "Booked";
                    this.toolItem.type = item[0].fields.AssetType;

                    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
                    this.http.put(`${BACKEND_URL}/update/${item[0].id}`, this.toolItem, { headers }).subscribe({});

                }
            });

        }

    }

    getNextId(): Promise<string> {
        var startId = 0;
        for (let index = 0; index < this.items.length; index++) {
            const currentItemId = Number(this.items[index].fields.Title);
            if (currentItemId > startId) {
                this.nextId = currentItemId + 1;
                startId = currentItemId;
            }

        }
        return this.nextId;
    }

    async getColumnChoices(columnId: string) {

        const account = this.msalService.instance.getAllAccounts()[0];

        if (account) {

            try {

                const token = await this.aqueireTokenSilently(account);

                const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
                const params = { columnId };

                this.http.get(`${BACKEND_URL}/columnChoices`, { headers, params }).subscribe(
                    (data: any) => {
                        this.choices = data.value;
                        this.updateGivenColumnChoices(columnId);
                    },
                    (error) => {
                        console.error('error getting choices:', error);
                    }
                );
            } catch (error) {
                console.error('token error:', error);
            }
        }

    }

    private updateGivenColumnChoices(columnId: string) {
        if (columnId == STATE_COLUMN_ID) {
            this.updateStates(this.choices);
        } else if (columnId == MANUFACTURER_COLUMN_ID) {
            this.updateManufacturers(this.choices);
        } else if (columnId == TYPE_COLUMN_ID) {
            this.updateTypes(this.choices);
        }
    }

}