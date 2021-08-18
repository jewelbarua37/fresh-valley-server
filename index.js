const express = require('express')
const app = express()
const { MongoClient} = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()


const port = 5000;


app.use(cors());
app.use(bodyParser.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bwfvb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log(err);
  
  const productsCollection = client.db("freshValley").collection("productsData");
  
  app.get('/productsData', (req, res) =>{
        productsCollection.find()
        .toArray((err, items) =>{
          res.send(items)
          
        })
  })


  app.post('/addProducts', (req, res) => {
        const newProduct = req.body;
        console.log('adding new products: ', newProduct);
        productsCollection.insertOne(newProduct)
        .then(result =>{
          console.log(result)
          console.log('inserted count', result.insertedCount)
          res.send(result.insertedCount > 0)
        })
  })

  app.delete('deleteProduct/:id', (req, res) =>{
        const id = ObjectId(req.params.id);
        console.log('delete this', id);
        productsCollection.findOneAndDelete({_id: id})
        .then(documents => res.send(!!documents.value))
  })
  // client.close();
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})







app.listen(process.env.PORT || 5000)