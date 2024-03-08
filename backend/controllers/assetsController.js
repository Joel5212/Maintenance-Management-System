const mongoose = require('mongoose')
const Asset = require('../models/assetModel')
const Category = require('../models/categoryModel')
const Location = require('../models/locationModel')
const { MongoClient, ObjectId } = require('mongodb');

const getAssets = async (req, res) => {

    const assets = await Asset.find({}).sort({ createdAt: -1 })

    const populatedAssets = await Promise.all(
        assets.map(async (asset) => {
            await asset.populate({ path: 'category', select: 'name' });
            await asset.populate({ path: 'location', select: 'name' });
            return asset
        })
    );

    res.status(200).json(populatedAssets)
}

const addAsset = async (req, res) => {
    try {
        const { name, price, description, parentAsset, categoryId, locationId } = req.body

        const asset = await Asset.create({ name: name, price: price, description: description, parentAsset: parentAsset, category: categoryId, location: locationId })

        res.status(200).json(asset);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const recursivelyDeleteChildAssets = async (parentAssetId, assetsCollection) => {
    // const session = await mongoose.startSession
    const deletedAssets = []

    const assetsToDelete = await assetsCollection.find({ parentAsset: ObjectId(parentAssetId) }).toArray()

    for (const assetToDelete of assetsToDelete) {

        const deletedAsset = await assetsCollection.findOneAndDelete({ _id: ObjectId(assetToDelete._id) })

        deletedAssets.push(deletedAsset.value._id)

        const deletedChildAssets = await recursivelyDeleteChildAssets(assetToDelete._id, assetsCollection)

        deletedAssets.push(...deletedChildAssets)
    }
    return deletedAssets
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
                return res.status(400).json({ error: 'No Such Asset' })
            }

            const assetToDelete = await assetsCollection.findOne({ _id: ObjectId(id) })

            if (!assetToDelete) {
                return res.status(404).json({ error: "No Such Asset" })
            }

            const deletedAssets = await recursivelyDeleteChildAssets(id, assetsCollection)

            const deletedAsset = await assetsCollection.findOneAndDelete({ _id: ObjectId(id) })

            deletedAssets.push(deletedAsset.value._id)

            res.status(200).json(deletedAssets)
        });
    }
    catch (err) {
        console.log(err.message)
        return res.status(404).json({ error: err.message })
    }
}

const updateAsset = async (req, res) => {
    try {

        const { id } = req.params

        const { name, price, description, parentAsset } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'No Such Asset' })
        }

        const asset = { name: name, price: price, description: description, parentAsset: parentAsset }

        const updatedAsset = await Asset.findOneAndUpdate({ _id: id }, { ...asset }, { new: true })

        if (!updatedAsset) {
            return res.status(404).json({ error: 'No Such Asset' })
        }

        res.status(200).json(updatedAsset)

    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { getAssets, addAsset, deleteAsset, updateAsset }