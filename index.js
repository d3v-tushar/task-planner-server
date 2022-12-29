const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 4000;


//Middleware
app.use(express.json());
app.use(cors());

//taskPlanner
//tushar2151

//MongoDB
const uri = "mongodb+srv://taskPlanner:tushar2151@learnph.159fxoq.mongodb.net/?retryWrites=true&w=majority";
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
            let query = {};
            if(req.query.email){
                query = req.query.email;
            }
            const cursor = taskCollection.find(query);
            const mytask = await cursor.toArray();
            res.send(mytask);
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