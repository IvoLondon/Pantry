import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
    {
        barcode: {
            type: Number,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number
        },
        calories: {
            type: Number
        },
        macros: {
            protein: {
                type: Number
            },
            carb: {
                total: {
                    type: Number
                },
                sugar: {
                    type: Number
                }
            },
            fat: {
                total : {
                    type: Number
                },
                saturated: Number,
                unsaturated: Number,
                trans: Number
            }
        }
    }
)

export const Item = mongoose.model('item', itemSchema);