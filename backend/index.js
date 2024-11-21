const express = require('express');
const {open} = require('sqlite');
const sqlite3 = require('sqlite3')
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const dBpath = path.join(__dirname,'usersTransactions.db');
const app = express();
app.use(express.json());
app.use(cors());
let db = null;
const dbPathDeploy = process.env.DB_PATH || path.join('/tmp', 'usersTransactions.db');
const PORT = process.env.PORT || 5000;
const destinationDir = path.dirname(dbPathDeploy);
if (!fs.existsSync(destinationDir)) {
  fs.mkdirSync(destinationDir, { recursive: true });
}

// Copy the database file if it doesn't already exist at the destination
if (!fs.existsSync(dbPathDeploy)) {
  fs.copyFileSync(dBpath, dbPathDeploy);
  console.log(`Database copied to ${dbPathDeploy}`);
} else {
  console.log(`Database already exists at ${dbPathDeploy}`);
}
const InitializeServerAndDatabase = async ()=>
{
    try
    {
        db = await open({
            filename:dbPathDeploy,
            driver:sqlite3.Database,
        })
        
        app.listen(PORT,()=>
        {
            console.log("Server is running at http://localhost:5000......")
        })
    }
    catch(e)
    {
        console.log(`Database error : ${e}`)
        process.exit(1)
    }
}
InitializeServerAndDatabase();

app.post("/",async (req,res)=>
{
    const {name,aadhar} = req.body;
    if(!name || !aadhar)
    {
        return res.status(400).send({error:"Fill all the fields"});
    }
    const insertQuery  = `
        INSERT INTO users (name,aadhar) VALUES ('${name}','${aadhar}');
    `
    try
    {
        const response = await db.run(insertQuery)
        res.send({success:`User added successfully. Your Id is ${response.lastID}`});
    }
    catch(e)
    {
        if(e.message.includes('FOREIGN KEY constraint failed'))
        {
            res.status(400).send({error:'Invalid User'});
        }
        else if (e.message.includes('UNIQUE constraint failed: users.aadhar')) {
            res.status(400).send({ error: 'Aadhar number already exists' });
          }
        else
        {
            res.status(500).send({error:e.message});
        }
    }
    
})

app.get('/user/:id',async (req,res)=>
{
    const {id} = req.params;
        const getName = `
        SELECT name FROM users WHERE id = ${id}
    `
    const transactions = `
        SELECT * FROM transactions WHERE userId=${id}
        ORDER BY timestamp ASC;
    `
    try
    {
        const transactionsList = await db.all(transactions);
        const response = await db.get(getName);
        const name = response.name
        res.send({name,transactionsList})
    }
    catch(e)
    {
        if(e.message.includes('Cannot read properties of undefined'))
        {
          return  res.status(500).send({error:'User Not Exists'});
        }
        res.status(500).send({error:e.message});
    }
    
})

app.post('/transaction',async(req,res)=>
{
    const {userId,amount,transactionType,status} = req.body;
    if(!userId || !amount || !transactionType || !status)
    {
        return res.status(500).send({error:'Amount is not Entered'});
    }
    const insertTransactionQuery = `
        INSERT INTO transactions (userId,amount,transactionType,status) VALUES
         (${userId},${amount},'${transactionType}','${status}')`;
        try
        {
            const response = await db.run(insertTransactionQuery);
            res.send({success:'Transaction Added Successfully'});
        }
        catch(e)
        {
            res.send(e.message);
        }
});

app.get('/alltransactions',async (req,res)=>
{
    const getAllTransactionsQuery = `
        SELECT * FROM transactions;
    `
    try
    {
        const AllTransactions = await db.all(getAllTransactionsQuery);
        res.send(AllTransactions)
    }
    catch(e)
    {
        res.status(500).send(e.message);
    }
    
})

app.get('/user/:userId/transaction/:id',async (req,res)=>
{
    const {userId,id} = req.params;
    const getTransaction = `
        SELECT * FROM transactions WHERE userId=${userId} AND id=${id}
    `;
    try
    {
        const response = await db.get(getTransaction);
        res.send(response)
    }
    catch(e)
    {
        res.status(500).send(e.message);
    }
});

app.put('/user/:userId/transaction/:id',async(req,res)=>
    {
        const {userId,id} = req.params;
        const {status} = req.body;
        if(!status)
        {
            return res.status(500).send({error:'Fill all the fileds'});
        }
        const updateTransactionQuery = `
            UPDATE transactions SET status='${status}' WHERE userId=${userId} AND id=${id} ;   
        `;
            try
            {
                const response = await db.run(updateTransactionQuery);
                res.send({success:'Transaction Updated Successfully'});
            }
            catch(e)
            {
                res.send(e.message);
            }
    });