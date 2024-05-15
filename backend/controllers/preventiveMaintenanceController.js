const mongoose = require('mongoose')
const PreventiveMaintenance = require('../models/preventiveMaintenanceModel')

// CREATE new preventiveMaintenance
const createPreventiveMaintenance = async (req, res) => {
    const { title, asset, servicers, frequencyType, frequency, startDate, completedDate, dueDate, priority, status, cost, description } = req.body

    // adding doc to db
    try {
        const preventiveMaintenance = await PreventiveMaintenance.create({ title: title, asset: asset, servicers: servicers, frequencyType: frequencyType, frequency: frequency, startDate: startDate, completedDate: completedDate, dueDate: dueDate, priority: priority, status: status, cost: cost, description: description })
        console.log("CREATED A PREVENTIVE")
        res.status(200).json(preventiveMaintenance)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// READ single preventiveMaintenance
const getPreventiveMaintenance = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such preventiveMaintenance' })
    }

    const preventiveMaintenance = await PreventiveMaintenance.findById(id)

    if (!preventiveMaintenance) {
        return res.status(400).json({ error: 'No such preventiveMaintenance' })
    }

    res.status(200).json(preventiveMaintenance)
    
}

const getPreventiveMaintenances = async (req, res) => {

    try {
        const preventiveMaintenances = await PreventiveMaintenance.aggregate([
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
                    },
                    completedDate: {
                        $dateToString: { format: "%Y-%m-%d", date: "$completedDate" }
                    },
                }
            },
            {
                $lookup: {
                    from: "users", // Replace with the actual collection name of servicers
                    localField: "servicers", // Field in the preventiveMaintenances collection
                    foreignField: "_id", // Field in the servicers collection to match on
                    as: "servicerDetails" // Where to put the resulting data
                }
            },
            {
                $unwind: {
                    path: "$servicerDetails",
                    preserveNullAndEmptyArrays: true // If no servicer is found, keep the preventiveMaintenance without a servicer
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
                    localField: "asset", // Field in the preventiveMaintenances collection
                    foreignField: "_id", // Field in the assets collection to match on
                    as: "assetDetails" // Where to put the resulting data
                }
            },
            {
                $unwind: {
                    path: "$assetDetails",
                    preserveNullAndEmptyArrays: true // If no asset is found, keep the preventiveMaintenance without an asset
                }
            },
            {
                $addFields: {
                    "asset": "$assetDetails.name" // Assumes the asset's name is stored under 'name'
                }
            },

        ]);
        res.status(200).json(preventiveMaintenances);
    } catch (error) {
        res.status(500).json({ message: "An error occurred while fetching preventiveMaintenances", error: error.message });
    }
}



const getCompletedPreventiveMaintenances = async (req, res) => {
    /*
    const preventiveMaintenances = await PreventiveMaintenance.find({ status: "Complete" }).sort({ createdAt: -1 })
    res.status(200).json(preventiveMaintenances)
    */
    try {
        const preventiveMaintenances = await PreventiveMaintenance.aggregate([
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
                    localField: "servicers", // Field in the preventiveMaintenances collection
                    foreignField: "_id", // Field in the servicers collection to match on
                    as: "servicerDetails" // Where to put the resulting data
                }
            },
            {
                $unwind: {
                    path: "$servicerDetails",
                    preserveNullAndEmptyArrays: true // If no servicer is found, keep the preventiveMaintenance without a servicer
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
                    localField: "asset", // Field in the preventiveMaintenances collection
                    foreignField: "_id", // Field in the assets collection to match on
                    as: "assetDetails" // Where to put the resulting data
                }
            },
            {
                $unwind: {
                    path: "$assetDetails",
                    preserveNullAndEmptyArrays: true // If no asset is found, keep the preventiveMaintenance without an asset
                }
            },
            {
                $addFields: {
                    "asset": "$assetDetails.name" // Assumes the asset's name is stored under 'name'
                }
            },

        ]);
        res.status(200).json(preventiveMaintenances);
    } catch (error) {
        res.status(500).json({ message: "An error occurred while fetching preventiveMaintenances", error: error.message });
    }
}

/*
// UPDATE a preventiveMaintenance
const updatePreventiveMaintenance = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such preventiveMaintenance' })
    }

    const preventiveMaintenance = await PreventiveMaintenance.findOneAndUpdate({ _id: id }, {
        ...req.body
    })

    if (!preventiveMaintenance) {
        return res.status(400).json({ error: 'No such preventiveMaintenance' })
    }

    res.status(200).json(preventiveMaintenance)
}
*/


const updatePreventiveMaintenance = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such preventiveMaintenance' })
    }

    const preventiveMaintenance = await PreventiveMaintenance.findOneAndUpdate({ _id: id }, {
        ...req.body
    })

    if (!preventiveMaintenance) {
        return res.status(400).json({ error: 'No such preventiveMaintenance' })
    }

    res.status(200).json(preventiveMaintenance)
}

// DELETE preventiveMaintenance
const deletePreventiveMaintenance = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such preventiveMaintenance' })
    }

    const preventiveMaintenance = await PreventiveMaintenance.findOneAndDelete({ _id: id })

    if (!preventiveMaintenance) {
        return res.status(400).json({ error: 'No such preventiveMaintenance' })
    }

    res.status(200).json(preventiveMaintenance)
}

module.exports = {
    createPreventiveMaintenance,
    getPreventiveMaintenances,
    getPreventiveMaintenance,
    getCompletedPreventiveMaintenances,
    updatePreventiveMaintenance,
    deletePreventiveMaintenance
}