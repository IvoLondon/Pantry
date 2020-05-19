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
  
export const createOne = model => async (req, res) => {
    req.body
    try {
        const doc = await model.create({ ...req.body })
        res.status(201).json({ data: doc })
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
  
export const crudControllers = model => ({
    removeOne: removeOne(model),
    updateOne: updateOne(model),
    getMany: getMany(model),
    getOne: getOne(model),
    getOneByField: getOneByField(model),
    createOne: createOne(model)
})
  