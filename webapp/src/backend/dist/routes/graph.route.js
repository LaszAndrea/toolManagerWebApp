import { Router } from 'express';
import { GraphService } from '../services/graph.service';
import { siteId, listId } from '../constants/urls';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
const router = Router();
const graphService = new GraphService(inject(HttpClient));
router.get('/', async (_, res) => {
    try {
        const items = await graphService.getListItems(siteId, listId);
        res.send(items);
        //res.json(items);
    }
    catch (error) {
        console.log("list error");
        //res.status(500).json({ error: error.message });
    }
});
router.get('/search', async (req, res) => {
    try {
        const searchQuery = req.query['q'];
        const accessToken = await graphService.aquireToken();
        const items = await graphService.searchListItems(accessToken, siteId, listId, searchQuery);
        res.send(items);
        //res.json(items);
    }
    catch (error) {
        console.log("search error");
        //res.status(500).json({ error: error.message });
    }
});
export default router;
