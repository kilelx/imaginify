// We import mongoose, and the type Mongoose
import mongoose, { Mongoose } from 'mongoose'

const MONGODB_URL = process.env.MONGODB_URL

interface MongooseConnection {
    // Connexion type: Mongoose or null (if there is no connexion)
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

/* As Next.js is serverless, you need to connect to the DB each time you need to do a server action
    Each request is handled independantly: allows a better maintainability & scalability
    If we do it this way, we would have to many open connexions
    Let's optimize it by caching the connexions
*/

// global = Node.js object used to store data in our whole app, type any to do not have any TS error
let cached : MongooseConnection = (global as any).mongoose

// If the connexion is not cached yet
if(!cached) {
    cached = (global as any).mongoose = {
        conn: null,
        promise: null
    }
}

// This function runs everytime we try connect our DB
export const connectToDatabase = async () => {
    // Check if there is already a connexion
    if(cached.conn) return cached.conn;

    if(!MONGODB_URL) throw new Error("Missing MONGODB_URL");

    // If we do not have a connexion, we make a new one
    cached.promise = 
        cached.promise || 
        mongoose.connect(MONGODB_URL, {
            dbName: 'imaginify', bufferCommands: false
        });
    
    cached.conn = await cached.promise;

    return cached.conn
}