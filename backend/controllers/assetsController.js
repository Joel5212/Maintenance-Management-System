const mongoose = require('mongoose')
const Asset = require('../models/assetModel')
const { MongoClient, ObjectId } = require('mongodb');

const getAssets = async (req, res) => {

    const users = await Asset.find({}).sort({ createdAt: -1 })

    res.status(200).json(users)
}

const addAsset = async (req, res) => {
    try {
        const { name, assetType, price, description, parentAsset } = req.body

        const asset = await Asset.create({ name: name, assetType: assetType, price: price, description: description, parentAsset: parentAsset, repairs: [], preventiveMaintenances: [], repairDetails: [], preventiveMaintenanceDetails: [] })

        res.status(200).json(asset);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const recusivelyDeleteChildAssets = async (parentAsset, assetsCollection) => {
    // const session = await mongoose.startSession
    const assetsToDelete = await assetsCollection.find({ parentAsset: ObjectId(parentAsset) }).toArray()

    console.log("CHILD", assetsToDelete)

    for (const assetToDelete of assetsToDelete) {
        await assetsCollection.findOneAndDelete({ _id: ObjectId(assetToDelete._id) })
        await recusivelyDeleteChildAssets(assetToDelete._id, assetsCollection)
    }
}

const deleteAsset = async (req, res) => {
    const { id } = req.params

    const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

    try {
        await client.connect()

        const session = client.startSession();
        const db = client.db();
        const assetsCollection = db.collection('assets');

        await session.withTransaction(async () => {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                console.log("HELLO")
                return res.status(400).json({ error: 'idNotValid' })
            }

            console.log(id)
            const assetToDelete = await assetsCollection.findOne({ _id: ObjectId(id) })

            console.log("FOUND?", assetToDelete)

            if (!assetToDelete) {
                throw new Error('assetNotFound')
            }

            console.log("HELLO")
            await recusivelyDeleteChildAssets(id, assetsCollection)

            await assetsCollection.findOneAndDelete({ _id: ObjectId(id) })

            console.log("DELETEDD", assetToDelete)
            res.status(200).json(assetToDelete)
        });
    }
    catch (err) {
        console.log(err.message)
        if (err.message === 'idNotValid') {
            return res.status(404).json({ error: "No Such Asset" })
        }
        else if (err.message === 'assetNotFound') {
            return res.status(404).json({ error: "No Such Asset" })
        }
        else {
            return res.status(404).json({ error: err.message })
        }
    }
}

const updateAsset = async (req, res) => {
    try {

        const { id } = req.params

        const { name, assetType, code, price, description, parentAsset } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'No Such Asset' })
        }

        const newAsset = { name: name, assetType: assetType, code: code, price: price, description: description, parentAsset: parentAsset }

        const asset = await Asset.findOneAndUpdate({ _id: id }, { ...newAsset }, { new: true })

        if (!asset) {
            return res.status(404).json({ error: 'No Such Asset' })
        }

        res.status(200).json(asset)

    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { getAssets, addAsset, deleteAsset, updateAsset }