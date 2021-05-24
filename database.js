const mongoose = require('mongoose');

let dbPassword = process.env.DB_PASSWORD
let dbName = "PokeApiDB"
let dbUserName = process.env.DB_USERNAME

if(process.env.NODE_ENV === 'test'){
    dbName = "testPokeApiDB"
}

let dbRoute = `mongodb+srv://${dbUserName}:${dbPassword}@pokeapidb.dfik9.mongodb.net/${dbName}?retryWrites=true&w=majority`

mongoose.connect(dbRoute, {useNewUrlParser: true, useUnifiedTopology: true});