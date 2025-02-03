import express from 'express';

// Model ref
import Cheese from '../models/cheese.js'

// Create express router object
const router = express.Router();

// Mock some data
let cheeses = [
    {id: 1, name: 'Marble'}, 
    {id: 2, name: 'Camembert'},
    {id: 3, name: 'Leicester'}
];

/**
 * @swagger
 * /api/v1/cheeses:
 *   get:
 *     summary: Retrieve all cheeses
 *     responses:
 *         200:
 *           description: A list of cheeses
 */

// GET: return all cheeses
router.get('/', async (req,res) => {

        // use cheese model to fetch all documents from cheeses collection in db
        let cheeses = await Cheese.find();

        if(!cheeses){
            return res.status(204).json({err: 'Not Found'});
        }
        return res.status(200).json(cheeses);
    

});

/**
 * @swagger
 * /api/v1/cheeses/{id}:
 *   get:
 *     summary: Find cheeses by its id
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: integer
 *           required: true
 *     responses: 
 *       200:
 *         description: Returns a single cheese
 *       404: 
 *         description: Not found
 */

// GET: (id) return selected cheese by id
router.get('/:id', async (req, res) => {
    let cheese = await Cheese.findById(req.params.id);

    if(!cheese){
        return res.status(404).json({msg: 'Not Found'});
    }

    return res.status(200).json(cheese);
});

/**
 * @swagger
 * /api/v1/cheeses:
 *   post:
 *     summary: add new cheese from POST body
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name: 
 *                 type: string  
 *     responses: 
 *       204:
 *         description: Resource created
 *       400:
 *         description: Bad Request
 */

// POST: add new cheese from POST body
router.post('/', async (req, res) => {
    if(!req.body){
        return res.status(400).json({err: 'Request Body Required'});
    }

    try{
        await Cheese.create(req.body);
        return res.status(201).json(); // 201 means resource created 
    }
    catch(err){
        return res.status(400).json({err: `Bad Request: ${err}`});
    }

});

/**
 * @swagger
 * /api/v1/cheeses/{id}:
 *   put:
 *     summary: update selected cheese from request body
 *     parameters:
 *       -name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name: 
 *                 type: string
 *     
 *     responses: 
 *       204:
 *         description: Resource updated
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not found
 */

// PUT: (id) update seelcted cheese
router.put('/:id', async (req, res) => {
    try{
        let cheese = await Cheese.findById(req.params.id);

    if(!cheese){
        return res.status(404).json({msg: 'Not Found'});
    }

    if (req.params.id != req.body._id){
        return res.status(400).json({msg: `Bad Request: _ids do not match`});
    }

    await Cheese.findByIdAndUpdate(req.params.id, req.body);
    return res.status(204).json(); // 204: Resource Modified

    }
    catch(err){
        return res.status(400).json({err: `Bad Request: ${err}`});
    }
    
});

/**
 * @swagger
 * /api/v1/cheeses/{id}:
 *   delete:
 *     summary: Remove selected cheese
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: integer
 *           required: true
 *     responses: 
 *       204:
 *         description: Resource updated (removed)
 *       404: 
 *         description: Not found
 */

// DELETE: (id) remove selected cheese
router.delete('/:id', async (req, res) => {
    let cheese = cheeses.findById(req.params.id);

    if(!cheese){
        return res.status(404).json({msg: 'Not Found'});
    }

    await Cheese.findByIdAndDelete(req.params.id);
    return res.status(204).json();
});

// Make controller public to rest of the app
export default router;