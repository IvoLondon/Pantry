import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
    {
        barcodeId: {
            type: String,
            required: true,
            unique: true
        },
        barcodeType: {
            type: String,
            required: true,
            lowercse: true,
            enum: ['ean_8', 'ean']
        },
        continuous: {
            type: Boolean,
            default: false
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