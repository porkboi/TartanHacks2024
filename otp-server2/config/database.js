const  mongoose = require('mongoose')

require('dotenv').config()

exports.connect = () => {
    mongoose.connect('mongodb+srv://jniow:<>@tartanhacks.gggzo9b.mongodb.net/?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology : true
    }).then(()=>console.log("DB Connected Successfully✅"))
    .catch((error)=>{ 
        console.log("this error occured"+ error)
        process.exit(1)
    })
}
