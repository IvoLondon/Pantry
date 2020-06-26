import { Store } from './store.model';
import { Stock } from './../stock/stock.model';
import { User } from './../user/user.model';
import mongoose from 'mongoose';

export const getOne = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.authUser });
        const itemInStore = await Store
            .findOne({ barcodeId: req.params.id })
            .lean()
            .exec();

        if (!itemInStore) {
            return res.status(400).send({message: "Item does not exist"}).end()
        }

        const stock = await Stock.findOne({owner: [user._id]});
        let itemInStock = {
            quantity: 1,
            continuous: false,
        };
        
        if(stock) {
            for(let i of stock.items) {
                if(JSON.stringify(i.item) == JSON.stringify(itemInStore._id)) { 
                    itemInStock = {
                        quantity: i.quantity,
                        continuous: i.continuous
                    }
                }
            }
        }
        
        res.status(200).json({ data: {item: itemInStore, ...itemInStock} })
    } catch (e) {
        console.error(e)
        res.status(400).send({message: e}).end()
    }
}

export const getOneByField = async (req, res) => {
    if(!Object.keys(req.body).length) {
        res.status(400).end()
    }
    try {
        const doc = await Store
            .findOne({ ...req.body })
            .lean()
            .exec()
  
        if (!doc) {
            return res.status(400).send('Item does not exist').end()
        }
  
        res.status(200).json({ data: doc })
    } catch (e) {
        console.error(e)
        res.status(400).send({status: 400}).end()
    }
}
  
export const createItemInStore = async (req, res) => {
    if (!req.body &&
        !req.body.store) res.status(400).send({ message: 'Missing creation data' }).end();
    
    try {
        let createdItem = await Store.create(req.body.store)
        if (req.body.stock) {
            const user = await User.findOne({ email: req.authUser });
            const stock = await Stock.findOne({ owner: [user._id] });
            createdItem = await Stock.findOneAndUpdate({ _id: stock._id },
                { 
                    $push: { 
                        items: {
                            item: createdItem._id,
                            ...req.body.stock
                        }
                    }
                }, { new: true })
        }
        res.status(201).send({ data: createdItem }).end()
    } catch (e) {
        res.status(400).send({ message: e }).end()
    }
}
  
export const updateOne = async (req, res) => {
    try {
        let stockItem = {};
        const { item:unit, quantity, continuous } = req.body;
        const storeItem = await Store.findOneAndUpdate({ _id: req.params.id },
            unit,
            { new: true }).lean().exec();
        if (!storeItem) {
            return res.status(400).end() 
        }
        
        if (req.body.quantity && req.body.quantity > 0) {
            const user = await User.findOne({ email: req.authUser });
            try {
                await Stock.findOneAndUpdate({ owner: [user._id], "items.item": mongoose.Types.ObjectId(req.params.id)},
                    {$set: {"items.$.quantity": quantity, "items.$.continuous": continuous }}, { new: true, upsert: true });
            } catch(e) {
                if (e.code === 2) {
                    // ADDS THE ITEM
                    await Stock.findOneAndUpdate({ owner: [user._id]},
                        { $push: {
                            "items": {
                                    "quantity": quantity,
                                    "continuous": continuous,
                                    "item": mongoose.Types.ObjectId(req.params.id),
                                }
                            }
                        }, { new: true });
                    }
                }
        }
        res.status(200).json({ data: { unit: storeItem, quantity: quantity, continuous: continuous } })
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}
  
// TODO: Decide if I need removeOne from STORE
// export const removeOne = (req, res) => {
//     try {
//         const removed = await Store.findOneAndRemove({
//             barcodeId: req.params.id
//         })
    
//         if (!removed) {
//             return res.status(400).end()
//         }
    
//         return res.status(200).json({ data: removed })
//     } catch (e) {
//         console.error(e)
//         res.status(400).end()
//     }
// }

export const controllers = {
    //removeOne: removeOne,
    updateOne: updateOne,
    getOne: getOne,
    getOneByField: getOneByField,
    createItemInStore: createItemInStore
}
  