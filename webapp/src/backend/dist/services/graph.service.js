import { HttpHeaders } from "@angular/common/http";
import { ConfidentialClientApplication } from '@azure/msal-node';
import { givenAuthority, clientId } from "../constants/urls";
export class GraphService {
    http;
    client;
    constructor(http) {
        this.http = http;
        const msalConfig = {
            auth: {
                clientId: clientId,
                authority: givenAuthority,
            }
        };
        this.client = new ConfidentialClientApplication(msalConfig);
    }
    async aquireToken() {
        try {
            const token = await this.client.acquireTokenByClientCredential(({
                scopes: ['https://graph.microsoft.com/.default'],
            }));
            return token?.accessToken || "";
        }
        catch (error) {
            console.error('Token acquisition error:', error);
            return "";
        }
    }
    async getListItems(siteId, listId) {
        const token = await this.aquireToken();
        if (token) {
            console.log('Access token acquired:', token);
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            this.http
                .get(`https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items?expand=fields`, { headers })
                .subscribe((data) => {
                console.log('Lista elemek:', data.value);
                return data.value;
            }, (error) => {
                console.error('API hívás hiba:', error);
            });
        }
    }
    async searchListItems(token, siteId, listId, searched) {
        if (token) {
            console.log('Access token acquired:', token);
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            //const siteId = 'developmentwithwork-my.sharepoint.com,67c3e702-3b2e-4758-9e1d-92176b400ed9,0dd8f522-61d5-4908-a825-0c2aace35443';
            //const listId = '5584d30b-7a4c-47cc-ae11-2a08a5c2f0b6';
            const filter = `$filter=startswith(fields/AssetType,'${searched}')`;
            this.http
                .get(`https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items?expand=fields&${filter}`, { headers })
                .subscribe((data) => {
                console.log('keresett elemek:', data.value);
                return data.value;
            }, (error) => {
                console.error('API hívás hiba:', error);
            });
        }
    }
}
