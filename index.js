const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// midel ware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.n3a0m.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const servicesCollection = client.db('geniusCar').collection('services');
        const ordersCollection = client.db('geniusCar').collection('orders');

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const services = await servicesCollection.findOne(query);
            res.send(services);
        })

        // Order API 

        app.get('/orders', async (req, res) => {
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = ordersCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        })

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.send(result);
        });

        app.patch('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = {_id: ObjectId(id)};
            const updatedDoc = {
                $set: {
                    status: status
                }            
            }
            const result = await ordersCollection.updateOne(query, updatedDoc);
            res.send(result)
        })

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await ordersCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {

    }
}

run().catch(error => console.log(error))

app.get('/', (req, res) => {
    res.send("Genius Car Server is Running");
})

app.listen(port, () => {
    console.log(`Genius server on PORT ${port}`);
})