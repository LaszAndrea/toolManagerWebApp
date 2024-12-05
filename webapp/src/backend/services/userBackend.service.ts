import { ConfidentialClientApplication } from '@azure/msal-node';
import { givenAuthority, clientId, clientSecretKey, GRAPH_API_URL, listId, siteId, userListId } from "../constants/urls";
import axios from 'axios';
import { user } from '../interfaces/user.interrface';

export class UserService {

    private client: ConfidentialClientApplication;

    constructor() {
        const msalConfig = {
            auth: {
                clientId: clientId,
                authority: givenAuthority,
                clientSecret: clientSecretKey
            }
        };

        this.client = new ConfidentialClientApplication(msalConfig);
    }

    async getUserItems(token: string): Promise<any> {

        if (token) {

            try {

                const response = await axios.get(`${GRAPH_API_URL}/sites/${siteId}/lists/${userListId}/items?expand=fields`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                return response.data;
            } catch (error) {
                console.log("getList user: axios error", error);
            }

        }
    }

    async addItemToList(token: string, userItem: user) {

        if (token) {

            try {

                console.log("useritem", userItem)

                const response = await axios.post(`https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${userListId}/items`, {
                    fields: {
                        Title: userItem.id,
                        name: userItem.name,
                        address: userItem.address,
                    },
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                return response.data;
            } catch (error) {
                console.log("addPerson: axios error", error);
            }

        }
    }

    async getPersonById(token: string, id: string) {

        if (token) {


            const filter = `$filter=fields/Title eq '${id}'`;

            try {

                const response = await axios.get(`https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${userListId}/items?expand=fields&${filter}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("backend getpersonbytitle: ", response.data)

                return response.data;
            } catch (error) {
                console.log("getItemByTitle: axios error", error);
            }

        }

    }

}