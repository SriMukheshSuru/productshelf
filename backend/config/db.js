import mongoose from 'mongoose';

export const connectDB  = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MONGODB Connected : ${conn.connection.host}`);
    }catch(error){
        console.error(`Error: ${conn.connection.host}`);
        process.exit(1); // 1 fail and 2 success
    }
};