const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to t-fashion server');
})


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.ksx2c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        // Connect to DB
        await client.connect();
        const productCollection = client.db("T-Fashion_DB").collection("products");
        
        // GET
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })

        // GET single item
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await productCollection.findOne(query);
            res.send(item);
        })
       
        // POST
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })

        //PUT
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updatedItem = req.body;
            console.log(updatedItem);
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedItem.updatedQuantity
                }
            }
            const result = await productCollection.updateOne(query, updatedDoc, options);
            res.send(result);
        })

        // DELETE
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })
        
    }
    finally {
        
    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log('Running is started');
})