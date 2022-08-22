const mongoose=require("mongoose");
const mongouri="mongodb://localhost:27017"


// mongodb+srv://scheduler:C9IixdpHJzfy3jng@cluster0.dmnsn.mongodb.net/media?retryWrites=true&w=majority


const connectToMongo = () => {
    
    mongoose.connect(mongouri, function (err, db) {
        if (err) throw err;
        console.log("Database created!");
        // db.close();
    })
}
module.exports = connectToMongo;

