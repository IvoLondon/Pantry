import { Stock } from './stock.model';
import { Store } from './../store/store.model';
import { User } from './../user/user.model';
import { model } from 'mongoose';

const createStock = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.authUser });
        await Stock.create({ name:req.body.name, owner: [ user._id ]})
        res.status(200).send({ data: 'Stock was created successfully' }).end();
    } catch(e) {
        res.status(400).send({ message: e }).end();
    }
}

const getItemFromStock = async (req, res) => {
    const itemBarcode = req.params.id;
    const userEmail = req.authUser.email;
    try {
        const userId = await User.findOne({email: userEmail});
        const itemObj = await Store.findOne({ barcodeId: itemBarcode });
        const stockObj = await Stock.findOne({ owner: [userId._id], items: [itemObj._id]});
        if (stockObj) {
            // TODO: RETURN ITEMS ONLY
            res.status(200).send({ data: stockObj }).end();
        } else {
            res.status(404).send({ message: 'Item does not exist in this stock' }).end();
        }
    } catch (e) {
        res.status(400).send({ message: e }).end();
    }
}

const addItemToStock = async (req, res) => {
    const itemBarcode = req.params.id;
    const userEmail = req.authUser.email;
    try {
        const userId = await User.findOne({email: userEmail});
        const itemObj = await Store.findOne({ barcodeId: itemBarcode });

        if (itemObj) {
            const stockObj = await Stock.findOne({ owner: [userId._id]});
            if (stockObj) {
                const itemsArr = [...stockObj.items];
                itemsArr.push(itemObj._id);
                const updatedStock = await Stock.findOneAndUpdate({ owner: [userId._id]}, { items: itemsArr }, {new: true});
                //.send({ data: updatedStock });
                res.status(200)
            } else {
                res.status(404).send({ message: 'Stock error' });
            }
        } else {
            res.status(404).send({ message: 'Item does not exist' });
        }
    } catch (e) {
        res.status(400).send({ message: e }).end();
    }
}

const getStockItems = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.authUser });
        const stock = await Stock.findOne({ owner: [user._id]}).populate('items.item').exec();
        res.status(200).send({ data: stock.items }).end();
    } catch (e) {
        res.status(400).send({ message: e }).end();
    }
}

// const updateItemInStock = async (req, res) => {
    // update quantity or continues
//     res.status(200).end();
// }

// const removeItemFromStock = async (req, res) => {
//     res.status(200).end();
// }

export const controllers = {
    getItemFromStock: getItemFromStock,
    addItemToStock: addItemToStock,
    getStockItems: getStockItems,
    createStock: createStock,
}