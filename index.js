const express = require('express')
const app = express()
 require('dotenv').config()
const port = process.env.PORT || 5000;

const cors = require('cors')
const { MongoClient } = require('mongodb');

const ObjectId = require('mongodb').ObjectId



//middle ware//
app.use(cors ());
app.use(express.json());
//middle ware//




//NEW CONNECT to data base and node server code end//
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bs9pl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//NEW CONNECT to data base and node server code end//

async function run() {
    try {
        await client.connect();
        const database = client.db("Travel-Blogs");
        const BlogsColloction = database.collection("Blogs");
        const  userColloction = database.collection("user");
       

//****************** All Get Api code ********************************************/

    //GEt  Find Multiple Documents Client site read code//
        app.get('/Blogs',async(req, res) =>{
            const cursor = BlogsColloction.find({});
            const Blogs= await cursor.toArray();
            res.send(Blogs)
        })
    //GEt  Find Multiple Documents Client site read code//
    

    // GET Find single data deatails Document Client site read code//
    app.get('/Blogs/:id',async (req, res) =>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const Blogs = await BlogsColloction.findOne(query);
      res.send(Blogs)
   })

  // GET Find single data deatails  Document Client site read code//

  //find  a single  order data//
    app.get("/mypost/:email", async (req, res) => {
      const result = await BlogsColloction.find({
        email: req.params.email,
      }).toArray();
      res.send(result);
    });

    //find  a single  order data//



    //****************** All Get Api code  End ********************************************/


    //***************** Update ApI Code************************************** */
    app.put("/Blogs/:id", async (req, res) => {
        const id = req.params.id;
        const updatedData = req.body;
        const query = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            status: updatedData.status,
          },
        };
        const result = await BlogsColloction.updateOne(
          query,
          updateDoc,
          options
        );

        res.json(result);
      });

       //***************** Update ApI Code End  ************************************** */
//******************** All Post Api  ********************************* */

    // POST Api Creact//
        app.post('/Blogs',async(req, res)=>{
            const Blogs = req.body;
            const result = await BlogsColloction.insertOne( Blogs);
            res.send(result);  
        })
    // POST Api Creact//

    // userinfo api//
    app.post('/user',async(req, res)=>{
        const user = req.body;
        const result = await userColloction.insertOne(user);
        res.send(result);  
        // console.log("user hiting")
    })
      //userinfo api//

  //user make admin//
    app.put('/makeadmin', async (req ,res) => {
      const filter = {email:req.body.email};
      const resualt = await userColloction .find(filter).toArray();
      if(resualt){
        const documents = await userColloction.updateOne(filter,{
          $set :{role:"admin"},
        })
       
      }}
    )
    //user make admin//

    //  // check admin or not
     app.get("/checkAdmin/:email", async (req, res) => {
      const result = await userColloction
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });



      


//******************** All Post Api  ********************************* */


//***************** All Delete Api *************************************** */
//Manage  product  api  code//
app.delete('/Blogs/:id', async (req, res)=>{
    const id = req.params.id;
    const query = {_id:ObjectId(id)};
    const result = await BlogsColloction.deleteOne(query)
    res.json(result)
  })
//Delete all order api  code//






//***************** All Delete Api *************************************** */
    
    
      } 
      
      finally {
        // await client.close();
      }

}

run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Hello World!')
  });
  app.listen(port, () => {
    console.log("Example" , port)
  });