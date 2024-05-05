const Repair = require('../models/repairModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')
const { ObjectId } = require('mongodb');

// CREATE new repair
const createRepair = async (req, res) => {
    // adding doc to db
    try {
        const { title, asset, startDate, dueDate, priority, servicers, status, cost, description } = req.body
        // Check if dueDate is after startDate
        if (new Date(dueDate) <= new Date(startDate)) {
            return res.status(400).json({ error: "Due date must be after start date" });
        }
        const repair = await Repair.create({
            title: title,
            asset: asset,
            cost: Math.round(cost * 100) / 100,
            priority: priority,
            startDate: new Date(),
            dueDate: dueDate,
            servicers: servicers,
            status: status,
            description: description
        })
        res.status(200).json(repair)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}



const getRepairs = async (req, res) => {
    try {
        const repairs = await Repair.aggregate([
            {
                $match: {
                    $or: [
                        { status: "Incomplete" },
                        { status: "Overdue" }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $addFields: {
                    dueDate: {
                        $dateToString: { format: "%Y-%m-%d", date: "$dueDate" }
                    },
                    startDate: {
                        $dateToString: { format: "%Y-%m-%d", date: "$startDate" }
                    }
                }
            },
            {
                $lookup: {
                    from: "users", // Replace with the actual collection name of servicers
                    localField: "servicers", // Field in the repairs collection
                    foreignField: "_id", // Field in the servicers collection to match on
                    as: "servicerDetails" // Where to put the resulting data
                }
            },
            {
                $unwind: {
                    path: "$servicerDetails",
                    preserveNullAndEmptyArrays: true // If no servicer is found, keep the repair without a servicer
                }
            },
            {
                $addFields: {
                    "servicers": "$servicerDetails.name" // Assumes the servicer's name is stored under 'name'
                }
            },
            {
                $lookup: {
                    from: "assets", // Replace with the actual collection name of assets
                    localField: "asset", // Field in the repairs collection
                    foreignField: "_id", // Field in the assets collection to match on
                    as: "assetDetails" // Where to put the resulting data
                }
            },
            {
                $unwind: {
                    path: "$assetDetails",
                    preserveNullAndEmptyArrays: true // If no asset is found, keep the repair without an asset
                }
            },
            {
                $addFields: {
                    "asset": "$assetDetails.name" // Assumes the asset's name is stored under 'name'
                }
            },

        ]);
        res.status(200).json(repairs);
    } catch (error) {
        res.status(500).json({ message: "An error occurred while fetching repairs", error: error.message });
    }
}

// READ single repair
const getRepair = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such repair' })
    }

    const repair = await Repair.findById(id)

    if (!repair) {
        return res.status(400).json({ error: 'No such repair' })
    }

    res.status(200).json(repair)
}

const getCompletedRepairs = async (req, res) => {
    /*
    const repairs = await Repair.find({ status: "Complete" }).sort({ createdAt: -1 })
    res.status(200).json(repairs)
    */
    try {
        const repairs = await Repair.aggregate([
            {
                $match: {
                    $or: [
                        { status: "Complete" }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $addFields: {
                    dueDate: {
                        $dateToString: { format: "%Y-%m-%d", date: "$dueDate" }
                    },
                    startDate: {
                        $dateToString: { format: "%Y-%m-%d", date: "$startDate" }
                    },
                    completedDate: {
                        $dateToString: { format: "%Y-%m-%d", date: "$completedDate" }
                    },
                }
            },
            {
                $lookup: {
                    from: "users", // Replace with the actual collection name of servicers
                    localField: "servicers", // Field in the repairs collection
                    foreignField: "_id", // Field in the servicers collection to match on
                    as: "servicerDetails" // Where to put the resulting data
                }
            },
            {
                $unwind: {
                    path: "$servicerDetails",
                    preserveNullAndEmptyArrays: true // If no servicer is found, keep the repair without a servicer
                }
            },
            {
                $addFields: {
                    "servicers": "$servicerDetails.name" // Assumes the servicer's name is stored under 'name'
                }
            },
            {
                $lookup: {
                    from: "assets", // Replace with the actual collection name of assets
                    localField: "asset", // Field in the repairs collection
                    foreignField: "_id", // Field in the assets collection to match on
                    as: "assetDetails" // Where to put the resulting data
                }
            },
            {
                $unwind: {
                    path: "$assetDetails",
                    preserveNullAndEmptyArrays: true // If no asset is found, keep the repair without an asset
                }
            },
            {
                $addFields: {
                    "asset": "$assetDetails.name" // Assumes the asset's name is stored under 'name'
                }
            },

        ]);
        res.status(200).json(repairs);
    } catch (error) {
        res.status(500).json({ message: "An error occurred while fetching repairs", error: error.message });
    }
}

/*
// UPDATE a repair
const updateRepair = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such repair' })
    }

    const repair = await Repair.findOneAndUpdate({ _id: id }, {
        ...req.body
    })

    if (!repair) {
        return res.status(400).json({ error: 'No such repair' })
    }

    res.status(200).json(repair)
}
*/


const updateRepair = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such repair'})
    }

    try {
        const repairToUpdate = await Repair.findById(id);

        if (!repairToUpdate) {
            return res.status(404).json({ error: 'No such repair' });
        }

        const { startDate, dueDate } = req.body;

        // Check if dueDate is after startDate
        if (startDate && dueDate && new Date(dueDate) <= new Date(startDate)) {
            return res.status(400).json({ error: "Due date must be after start date" });
        }

        const updatedRepair = await Repair.findByIdAndUpdate(id, req.body, { new: true });

        res.status(200).json(updatedRepair);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// DELETE repair
const deleteRepair = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such repair' })
    }

    const repair = await Repair.findOneAndDelete({ _id: id })

    if (!repair) {
        return res.status(400).json({ error: 'No such repair' })
    }

    res.status(200).json(repair)
}

module.exports = {
    createRepair,
    getRepairs,
    getRepair,
    getCompletedRepairs,
    updateRepair,
    deleteRepair
}