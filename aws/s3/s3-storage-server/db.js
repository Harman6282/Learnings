import mongoose from "mongoose"

export async function connectToDB() {
    console.log("process.env.MONGODB_URL", process.env.MONGODB_URL)

    try {

        await mongoose.connect(process.env.MONGODB_URL)
        console.log("db connected")
    } catch (error) {
        console.log(error)
    }
}