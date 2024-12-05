import { GraphService } from '../services/graph.service';
import { Router } from 'express';

const router = Router();
const graphService = new GraphService();

router.get('/', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {

      const items = await graphService.getListItems(token);
      res.send(items);

    } else {
      console.log("router list token error");
    }

  } catch (error) {
    console.error('router list error:', error);
  }

});

router.get('/search', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];

    if(token){
      const searched = req.query['q'] as string;
      const pageType = req.query['url'] as string;

      const items = await graphService.searchListItems(token, searched, pageType);
      res.send(items);
    }else{
      console.log("router search token error");
    }

  } catch (error) {
    console.log("search error");
  }
});

router.post('/add-item', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {
      await graphService.addItemToList(token, req.body);
    } else {
      console.log("additem token error");
    }

  } catch (error) {
    console.error('additem error:', error);
  }

});

router.put('/update/:itemId', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {
      const itemId = req.params.itemId;
      await graphService.updateItemOnList(token, req.body, itemId);
    } else {
      console.log("updateitem token error");
    }

  } catch (error) {
    console.error('updateitem error:', error);
  }

});

router.delete('/deleteItem/:itemId', async (req, res) => {

  try {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {
      const itemId = req.params.itemId;
      await graphService.deleteItemByTitle(token, itemId);
    } else {
      console.log("deleteitem token error");
    }

  } catch (error) {
    console.error('deleteitem error:', error);
  }

});

router.get('/getItem/:itemId', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {
      if(req.params.itemId){
        const itemId = req.params.itemId;
        const data = await graphService.getItemByTitle(token, itemId);
        res.send(data);
      }else{
        console.log("getItemID param error");
      }
    } else {
      console.log("getItemByID token error");
    }

  } catch (error) {
    console.error('additem error:', error);
  }

});

router.get('/get-available-items', async (req,res) =>{

  try {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {

      const items = await graphService.getAvailableItems(token);
      res.send(items);

    } else {
      console.log("router list token error");
    }

  } catch (error) {
    console.error('router list error:', error);
  }

})

router.get('/get-other-items', async (req,res) =>{

  try {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {

      const items = await graphService.getOtherItems(token);
      res.send(items);

    } else {
      console.log("router list token error");
    }

  } catch (error) {
    console.error('router list error:', error);
  }

})

router.get('/columnChoices', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    const columnId = req.query.columnId as string;

    if (token) {

      const items = await graphService.getChoicesFromColumns(token, columnId);
      res.send(items);

    } else {
      console.log("choices token error");
    }

  } catch (error) {
    console.error('choices error:', error);
  }

});

export default router;
