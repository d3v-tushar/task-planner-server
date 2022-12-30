const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectID, ObjectId } = require('bson');
const app = express();
const port = process.env.PORT || 4000;
require('dotenv').config();


//Middleware
app.use(express.json());
app.use(cors());

//MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@learnph.159fxoq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async() =>{
    try{
        const taskCollection = client.db("taskPlanner").collection("alltask");
        app.post('/mytask', async(req, res) =>{
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        });

        app.get('/mytask', async(req, res) =>{
            const email = req.query.email;
            const query = {email: req.query.email}
            const cursor = taskCollection.find(query);
            const mytask = await cursor.toArray();
            res.send(mytask);
        });

        app.get('/mytask/status', async(req, res) =>{
            const email = req.query.email;
            const query = {email: req.query.email, completed: true}
            const cursor = taskCollection.find(query);
            const mytask = await cursor.toArray();
            res.send(mytask);
        });

    //API for Editing Task
    app.put('/mytask/:id', async(req, res) =>{
        const id = req.params.id;
        const filter = {_id: ObjectId(id)};
        const options = { upsert: true };
        const update = req.body;
        const updateTask = {$set: {
            discription: update.discription
        }}
        const result = await taskCollection.updateOne(filter, updateTask, options);
        res.send(result);
    });

    //Updating Task Status
    app.patch('/mytask/:id', async(req, res)=>{
        const id = req.params.id;
        const status = req.body.completed;
        const query = {_id: ObjectId(id)};
        const updatedDoc = {
            $set:{
                completed: status
            }
        }
        const result = await taskCollection.updateOne(query, updatedDoc);
        res.send(result);
    });

    //Delete Task
    app.delete('/mytask/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await taskCollection.deleteOne(query);
        res.send(result);
    });

    }
    finally{
        // client.close();
    }
};
run().catch(error => console.log(error));


app.get('/', (req, res) =>{
    res.send('Task-Planner Server is Running');
});

app.listen(port, () =>{
    console.log(`Task-Planner Server is Running on Port ${port}`);
});