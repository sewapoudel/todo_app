import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose || { conn: null, promise: null }; // Initialize cached if not present

export async function connectToDB() {
    if (cached.conn) {
        return cached.conn; // Return cached connection if available
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
          
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise; // Await the connection promise
    } catch (e) {
        cached.promise = null; // Reset promise on error
        console.error("Error connecting to MongoDB:", e);
        throw e; // Re-throw the error for handling upstream
    }

    return cached.conn; // Return the established connection
}
