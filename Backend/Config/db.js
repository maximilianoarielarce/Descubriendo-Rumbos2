import { MongoClient } from "mongodb";
import "dotenv/config.js";

let client;
let clientPromise;

export async function db() {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI no está definida");
    }

    if (client) {
        return client.db(process.env.DB_NAME);
    }

    if (!clientPromise) {
        const mongoClient = new MongoClient(process.env.MONGO_URI);
        clientPromise = mongoClient.connect().then((connected) => {
            client = connected;
            console.log("🔥 Conectado a MongoDB Atlas");
            return connected;
        });
    }

    const connectedClient = await clientPromise;
    return connectedClient.db(process.env.DB_NAME);
}
