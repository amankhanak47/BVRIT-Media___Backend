const mongoose =require('mongoose')
const { Schema } = mongoose;

const Userimg = new Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
    img: {
     type:String
 }
});

module.exports=mongoose.model('Userimg',Userimg)