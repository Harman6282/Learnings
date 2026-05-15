import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    Price: Number,
    filename: String
})

export const ProductModel = mongoose.model("Product", productSchema)