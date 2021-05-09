const mongodb = require('mongodb');
const { MongoClient , ObjectID } = mongodb;
const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

const Client = new MongoClient(connectionURL ,  { useUnifiedTopology: true });

const id = new ObjectID();

console.log(id.id.length);

Client.connect((err,client) => {

    const db = client.db(databaseName);

    if(err)
    return console.log('err');
    
    console.log('connected!');

    const task1 = {
        name: 'naman',
        age: 19
    }

    // db.collection('tasks').insertOne({ task1 } , (error , result) => {
       
    //     if(error)
    //     console.log(error);
    //     else
    //     console.log(result.ops);
    // })
     //client.close();

     db.collection('tasks').updateOne({
         _id: new ObjectID("60819a1bd8d79c327851868b")
     },{
         $unset:{
            name : 'naman updated',
         }
     },(error , result)=>{
         if(error)
         console.log(error);
         else console.log(result.ops);
         //client.close();
     })
})
