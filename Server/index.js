const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = process.env.DB_PATH;
let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Get
app.get('/', (req, res) => {
    res.send('<h1>Gym Membership</h1>');
});


// Post
app.post('/placeOrder', (req, res) => {
    const memberDetails = req.body;
    memberDetails.purchaseTime = new Date();

    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("powerXGym").collection("order");
        collection.insertOne(memberDetails, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
            } else {
                res.send(result.ops[0]);
            }
        });
        client.close();
    });
});

const port = process.env.PORT || 3200;
app.listen(port, () => console.log(`Listening to port ${port}`));