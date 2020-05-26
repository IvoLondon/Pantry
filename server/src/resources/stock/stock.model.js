import mongoose from 'mongoose';

const stock = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
        },
        owner: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        }],
        items: [{
            item: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "store",
            },
            continuous: {
                type: Boolean,
                default: false
            },
            quantity: {
                type: Number
            },
        }]
    }
)
 
export const Stock = mongoose.model('stock', stock);