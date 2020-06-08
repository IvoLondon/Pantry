export interface ItemInterface {
    quantity: number,
    continuous: boolean,
    item: {
        name: string,
        calories: number,
        barcodeId: string,
        barcodeType: string,
        macros: Macros
    }
}

interface Macros {
    carb: Carb,
    fat: Fat,
    protein: number
}

interface Carb {
    total: number,
    sugar: number
}

interface Fat {
    total: number,
    saturated: number,
    unsaturated: number,
    trans: number
}
