import {
    ItemInterface
} from './constInterfaces';

export const INITIAL_ITEM: ItemInterface = {
    quantity: 0,
    continuous: false,
    item: {
        name: '',
        calories: 0,
        barcodeId: '',
        barcodeType: '',
        macros: {
            carb: { total: 0, sugar: 0 },
            fat: { total: 0, saturated: 0, unsaturated: 0, trans: 0 },
            protein: 0
        },    
    }
};