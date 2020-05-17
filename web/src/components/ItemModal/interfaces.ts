export interface ItemInterface {
    name: string,
    quantity: number,
    calories: number,
    barcodeId: string,
    barcodeType: string,
    continuous: boolean,
    macros: Macros
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
