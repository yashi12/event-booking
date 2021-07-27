const mongoose = require('mongoose');
const mongoURI =`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.tue5k.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('MongoDB connected...');
    } catch (err) {
        console.log(err.message);
        //Exit process with failure
        process.exit(1);
    }
}

module.exports = connectDB;