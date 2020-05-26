import { Store } from './store.model';
import { Stock } from './../stock/stock.model';
import { User } from './../user/user.model';

export const getOne = model => async (req, res) => {
    try {
        const doc = await model
            .findOne({ barcodeId: req.params.id })
            .lean()
            .exec()
        if (!doc) {
            return res.status(400).send({message: "Item does not exist"}).end()
        }
  
        res.status(200).json({ data: doc })
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}

export const getOneByField = model => async (req, res) => {
    if(!Object.keys(req.body).length) {
        res.status(400).end()
    }
    try {
        const doc = await model
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
  
export const getMany = model => async (req, res) => {
    try {
        const docs = await model
            .find({})
            .lean()
            .exec()
  
        res.status(200).json({ data: docs })
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}

export const createItemInStore = async (req, res) => {
    try {
        const doc = await Store.create({ ...req.body })
        res.status(201).json({ data: doc })
    } catch (e) {
        res.status(400).send({ message: e.errmsg }).end()
    }
}
  
export const createItemAndAddInStock = async (req, res) => {
    if (!req.body ||
        !req.body.stock ||
        !req.body.store) res.status(400).send({ message: 'Missing creation data' }).end();
    
    try {
        const user = await User.findOne({ email: req.authUser });
        const store = await Store.create(req.body.store)
        const stock = await Stock.findOne({ owner: [user._id] });
        const updatedStock = await Stock.findOneAndUpdate({ _id: stock._id },
                { 
                    items: [
                        ...stock.items,
                        {
                            item: store._id,
                            ...req.body.stock
                        }
                    ]
                })
        res.status(201).send({ data: updatedStock }).end()
    } catch (e) {
        res.status(400).send({ message: e.errmsg }).end()
    }
}
  
export const updateOne = model => async (req, res) => {
    try {
        const updatedDoc = await model
            .findOneAndUpdate(
            {
                _id: req.params.id
            },
            req.body,
            { new: true }
            )
            .lean()
            .exec()
    
        if (!updatedDoc) {
            return res.status(400).end()
        }
    
        res.status(200).json({ data: updatedDoc })
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}
  
export const removeOne = model => async (req, res) => {
    try {
        const removed = await model.findOneAndRemove({
            barcodeId: req.params.id
        })
    
        if (!removed) {
            return res.status(400).end()
        }
    
        return res.status(200).json({ data: removed })
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}

export const controllers = {
    removeOne: removeOne(Store),
    updateOne: updateOne(Store),
    getMany: getMany(Store),
    getOne: getOne(Store),
    getOneByField: getOneByField(Store),
    createItemInStore: createItemInStore,
    createItemAndAddInStock: createItemAndAddInStock
}
  