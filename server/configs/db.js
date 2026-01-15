import mongoose, { mongo } from "mongoose";

const connectDB = async () => {
    try{
        mongoose.connection.on("connected",() => {
            console.log("DB connected successfully")
        })

        let mongodbURI = process.env.MONGO_URI

        const projectName = 'resume-builder';
        if(!mongodbURI){
            throw new Error("MONGO_DB URI environment variable not set");
        }
        if(mongodbURI.endsWith('/')){
            mongodbURI = mongodbURI.slice(0,-1);
        }

        await mongoose.connect(`${mongodbURI}/${projectName}`);
    }
    catch(err){
        console.error("Error connecting to MOngoDB: ",err);
    }
}

export default connectDB;