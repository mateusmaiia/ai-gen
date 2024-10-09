import mongoose from 'mongoose';

export default async function db(){
    if(mongoose.connection.readyState >= 1) return;

    try {
      await mongoose.connect(process.env.DATABASE as string)
      console.log("Sucesso ao conectar no banco de dados")
    } catch (error) {
      throw new Error("throw new Error db function erro ao conectar no banco de dados: " + error)
    }
}