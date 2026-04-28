const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

async function startApp() {
    try {
        await client.connect();
        console.log("Connected to MongoDB (Expense Tracker)");
        
        const db = client.db("expense_db");
        const collection = db.collection("expenses");

        // 1. Add Expense
        app.post('/add', async (req, res) => {
            const result = await collection.insertOne(req.body);
            res.send(result);
        });

        // 2. Get All Expenses
        app.get('/list', async (req, res) => {
            const list = await collection.find({}).toArray();
            res.send(list);
        });

        // 3. Delete Expense by Item Name
        app.delete('/remove/:name', async (req, res) => {
            const result = await collection.deleteOne({ itemName: req.params.name });
            res.send(result);
        });

        app.listen(3000, () => {
            console.log("Tracker running at http://localhost:3000");
        });

    } catch (err) {
        console.error("DB Error:", err);
    }
}

startApp();
