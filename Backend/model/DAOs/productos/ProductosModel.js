/* import { connectdb } from "./Config/db.js";
import { ObjectId } from "mongodb";

const collection = () => connectdb().collection("productos");

export const ProductosModel = {
    findAll: () => collection().find().toArray(),

    findById: (id) =>
        collection().findOne({ _id: new ObjectId(id) }),

    create: (data) =>
        collection().insertOne(data),

    update: (id, data) =>
        collection().updateOne(
            { _id: new ObjectId(id) },
            { $set: data }
        ),

    remove: (id) =>
        collection().deleteOne({ _id: new ObjectId(id) }),
};
 */

import { db } from "../../../Config/db.js";
import { ObjectId } from "mongodb";

const collection = () => db().then(conn => conn.collection("productos"));

export const ProductosModel = {
    
    findAll: async () => {
        const col = await collection();
        return col.find().toArray();
    },

    findById: async (id) => {
        const col = await collection();
        return col.findOne({ _id: new ObjectId(id) });
    },

    create: async (data) => {
        const col = await collection();
        return col.insertOne(data);
    },

    update: async (id, data) => {
        const col = await collection();
        return col.updateOne(
            { _id: new ObjectId(id) },
            { $set: data }
        );
    },

    remove: async (id) => {
        const col = await collection();
        return col.deleteOne({ _id: new ObjectId(id) });
    },
};
