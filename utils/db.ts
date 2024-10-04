import mongoose from 'mongoose';

export default async function db(){
    if(mongoose.connection.readyState >= 1) return

    await mongoose.connect(process.env.DATABATA as string)
}