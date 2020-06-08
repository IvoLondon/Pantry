export const itemData = {
    itemOne: {
        store: { 
            barcodeId: "12345",
            barcodeType: "ean_8",
            name: "testItem",
            calories: 250,
            macros: {
                protein: 10,
                carb: {
                    total: 10,
                    sugar: 5
                },
                fat: {
                    total : 2,
                    saturated: 1,
                    unsaturated: 1,
                    trans: 1
                }
            }
        },
    },
    itemTwo: {
        store: { 
            barcodeId: "54321",
            barcodeType: "ean",
            name: "testItem2",
            calories: 50,
            macros: {
                protein: 10,
                carb: {
                    total: 10,
                    sugar: 5
                },
                fat: {
                    total : 2,
                    saturated: 1,
                    unsaturated: 1,
                    trans: 1
                }
            }
        },
    },
    itemWithStorageOne: {
        store: { 
            barcodeId: "54321",
            barcodeType: "ean",
            name: "testItem2",
            calories: 50,
            macros: {
                protein: 10,
                carb: {
                    total: 10,
                    sugar: 5
                },
                fat: {
                    total : 2,
                    saturated: 1,
                    unsaturated: 1,
                    trans: 1
                }
            }
        },
        storage: {
            continuous: false,
            quantity: 1
        }
    }
}