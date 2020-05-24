import mongoose from 'mongoose';

const store = new mongoose.Schema(
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
        name: {
            type: String,
            required: true
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

export const Store = mongoose.model('store', store);