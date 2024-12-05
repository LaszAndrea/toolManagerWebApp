import { Router } from 'express';
import { UserService } from '../services/userBackend.service';

const router = Router();
const userService = new UserService();


router.get('/get-users', async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];

        if (token) {

            const users = await userService.getUserItems(token);
            res.send(users);

        } else {
            console.log("router getuser token error");
        }

    } catch (error) {
        console.error('router list error:', error);
    }

});

router.post('/add-person', async (req, res) => {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
  
      if (token) {
        await userService.addItemToList(token, req.body);
      } else {
        console.log("addPerson token error");
      }
  
    } catch (error) {
      console.error('addPerson error:', error);
    }
  
  });

  router.get('/getPerson/:personId', async (req, res) => {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
  
      if (token) {
        if(req.params.personId){
          const itemId = req.params.personId;
          console.log("getPerson itemid", itemId)
          const data = await userService.getPersonById(token, itemId);
          res.send(data);
        }else{
          console.log("get person by ide param error");
        }
      } else {
        console.log("get person by id token error");
      }
  
    } catch (error) {
      console.error('getPersonById error:', error);
    }
  
  });

export default router;
