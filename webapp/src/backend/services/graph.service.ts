import { ConfidentialClientApplication } from '@azure/msal-node';
import { givenAuthority, clientId, clientSecretKey, GRAPH_API_URL, listId, siteId } from "../constants/urls";
import axios from 'axios';
import { toolItem } from '../interfaces/listItem.interface';

export class GraphService {

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

    async getListItems(token: string): Promise<any> {

        if (token) {

            try {

                const response = await axios.get(`${GRAPH_API_URL}/sites/${siteId}/lists/${listId}/items?expand=fields`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                return response.data;
            } catch (error) {
                console.log("getList: axios error", error);
            }

        }
    }

    async getAvailableItems(token: string): Promise<any> {

        if (token) {

            try {

                const response = await axios.get(`https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items?expand=fields&$filter=fields/Status eq 'Available'`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                return response.data;
            } catch (error) {
                console.log("getAvailable: axios error", error);
            }

        }
    }

    async getOtherItems(token: string): Promise<any> {

        if (token) {

            try {

                const response = await axios.get(`https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items?expand=fields&$filter=fields/Status ne 'Available'`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                return response.data;
            } catch (error) {
                console.log("getOtherItems: axios error", error);
            }

        }
    }

    async searchListItems(token: string, searched: string, url: string): Promise<any> {

        if (token) {

            const filter = `$filter=startswith(fields/AssetType,'${searched}')`;
            let statusFilter = ''
            if(url == "/deploy"){
                statusFilter = `and fields/Status ne 'Available'`;
            }else if(url == "/deposit"){
                statusFilter = `and fields/Status eq 'Available'`;
            }

            const fullFilter = filter + statusFilter;

            try {

                const response = await axios.get(`https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items?expand=fields&${fullFilter}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                return response.data;
            } catch (error) {
                console.log("search: axios error", error);
            }

        }
    }

    async addItemToList(token: string, listItem: toolItem) {

        if (token) {

            try {

                const response = await axios.post(`https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items`, {
                    fields: {
                        Title: listItem.id,
                        Status: listItem.state,
                        Manufacturer: listItem.manufacturer,
                        Model: listItem.model,
                        AssetType: listItem.type,
                        SerialNumber: listItem.serialNumber,
                        PurchaseDate: listItem.dateOfPurchase,
                        PurchasePrice: listItem.price,
                        photoURL: listItem.photoURL
                    },
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                return response.data;
            } catch (error) {
                console.log("additem: axios error", error);
            }

        }
    }

    async updateItemOnList(token: string, listItem: toolItem, itemId: string) {

        if (token) {

            try {

                const response = await axios.patch(`https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items/${itemId}`, {
                    fields: {
                        Status: listItem.state,
                        Manufacturer: listItem.manufacturer,
                        Model: listItem.model,
                        AssetType: listItem.type,
                        SerialNumber: listItem.serialNumber,
                        PurchaseDate: listItem.dateOfPurchase,
                        PurchasePrice: listItem.price,
                        photoURL: listItem.photoURL
                    },
                }, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
                });

                return response.data;
            } catch (error) {
                console.log("updateItem: axios error", error);
            }

        }
    }

    async getItemByTitle(token: string, title: string) {

        if (token) {


            const filter = `$filter=fields/Title eq '${title}'`;

            try {

                const response = await axios.get(`https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items?expand=fields&${filter}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                return response.data;
            } catch (error) {
                console.log("getItemByTitle: axios error", error);
            }

        }

    }

    async deleteItemByTitle(token: string, itemId: string) {

        if (token) {

            try {

                const response = await axios.delete(`https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items/${itemId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                return response.data;
            } catch (error) {
                console.log("delete: axios error", error);
            }

        }

    }

    async getChoicesFromColumns(token: string, columnId: string) {

        if (token) {

            try {

                const response = await axios.get(`https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/columns/${columnId}/choice/choices/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                return response.data;
            } catch (error) {
                console.log("getChoices axios error", error);
            }

        }

    }

}