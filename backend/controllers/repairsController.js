const Repair = require('../models/repairModel')
const Failure = require('../models/failureModel')
const Category = require('../models/categoryModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')
const { ObjectId } = require('mongodb');
const axios = require('axios');

// CREATE new repair
const createRepair = async (req, res) => {
    // adding doc to db
    try {
        const { title, asset, startDate, dueDate, priority, assignedUser, assignedTeam, status, cost, description, isFailure, failure, failureDate, failureTitle, failureCause, failureObservation, procedure, procedureTitle, procedureDescription, category } = req.body

        // Subtract one day from the current date, newDate() operates on UTC time, should be on PST
        // const startDate = new Date(new Date().toLocaleDateString('en-CA'))
        // startDate.setDate(startDate.getDate() - 1)

        let roundedCost = null

        if (cost) {
            roundedCost = Math.round(cost * 100) / 100
        }

        let newRepair = null

        if (failure) {
            newRepair = { title: title, asset: asset, startDate: startDate, dueDate: dueDate, priority: priority, assignedUser: assignedUser, assignedTeam: assignedTeam, status: status, cost: roundedCost, description: description, isFailure: isFailure, failureDate: failureDate, failure: failure, procedure: null, procedureTitle: null, procedureDescription: null }
        }
        else if (failureTitle && failureCause && failureObservation) {
            const categoryExists = await Category.findOne({ _id: ObjectId(category) })

            if (!categoryExists) {
                return res.status(404).json({ error: 'Category does not exist' })
            }

            const observation = failureObservation

            const flaskResponse = await axios.post('http://127.0.0.1:4000/convert-to-dense-vector', { observation })

            const denseVectorOfObservation = flaskResponse.data.dense_vector_of_observation

            let newFailure = null

            if (procedure) {
                newFailure = await Failure.create({ title: failureTitle, observation: failureObservation, denseVectorOfObservation: denseVectorOfObservation, cause: failureCause, procedure: procedure, procedureTitle: null, procedureDescription: null, category: category })
            }
            else if (!procedure && procedureTitle && procedureDescription) {
                newFailure = await Failure.create({ title: failureTitle, observation: failureObservation, denseVectorOfObservation: denseVectorOfObservation, cause: failureCause, procedure: null, procedureTitle: procedureTitle, procedureDescription: procedureDescription, category: category })
            }
            else {
                newFailure = await Failure.create({ title: failureTitle, observation: failureObservation, denseVectorOfObservation: denseVectorOfObservation, cause: failureCause, procedure: null, procedureTitle: null, procedureDescription: null, category: category })
            }

            newRepair = { title: title, asset: asset, startDate: startDate, dueDate: dueDate, priority: priority, assignedUser: assignedUser, assignedTeam: assignedTeam, status: status, cost: roundedCost, description: description, isFailure: isFailure, failureDate: failureDate, failure: newFailure._id, procedure: null, procedureTitle: null, procedureDescription: null }
        }
        else if (procedure) {
            newRepair = { title: title, asset: asset, startDate: startDate, dueDate: dueDate, priority: priority, assignedUser: assignedUser, assignedTeam: assignedTeam, status: status, cost: roundedCost, description: description, isFailure: isFailure, failureDate: failureDate, failure: null, procedure: procedure, procedureTitle: null, procedureDescription: null }
        }
        else if (procedureTitle && procedureDescription) {
            newRepair = { title: title, asset: asset, startDate: startDate, dueDate: dueDate, priority: priority, assignedUser: assignedUser, assignedTeam: assignedTeam, status: status, cost: roundedCost, description: description, isFailure: isFailure, failureDate: failureDate, failure: null, procedure: null, procedureTitle: procedureTitle, procedureDescription: procedureDescription }
        }
        else {
            newRepair = { title: title, asset: asset, startDate: startDate, dueDate: dueDate, priority: priority, assignedUser: assignedUser, assignedTeam: assignedTeam, status: status, cost: roundedCost, description: description, isFailure: isFailure, failureDate: failureDate, failure: null, procedure: null, procedureTitle: null, procedureDescription: null }
        }

        const repair = await Repair.create(newRepair)

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
            // {
            //     $addFields: {
            //         dueDate: {
            //             $dateToString: { format: "%Y-%m-%d", date: "$dueDate" }
            //         },
            //         startDate: {
            //             $dateToString: { format: "%Y-%m-%d", date: "$startDate" }
            //         },
            //         failureDate: {
            //             $dateToString: { format: "%Y-%m-%d", date: "$failureDate" }
            //         }
            //     }
            // },
            {
                $lookup: {
                    from: "users", // Replace with the actual collection name of servicers
                    localField: "assignedUser", // Field in the repairs collection
                    foreignField: "_id", // Field in the servicers collection to match on
                    as: "assignedUser" // Where to put the resulting data
                }
            },
            {
                $lookup: {
                    from: "teams", // Replace with the actual collection name of servicers
                    localField: "assignedTeam", // Field in the repairs collection
                    foreignField: "_id", // Field in the servicers collection to match on
                    as: "assignedTeam" // Where to put the resulting data
                }
            },
            {
                $lookup: {
                    from: "assets", // Replace with the actual collection name of assets
                    localField: "asset", // Field in the repairs collection
                    foreignField: "_id", // Field in the assets collection to match on
                    as: "asset" // Where to put the resulting data
                }
            },
            {
                $unwind: {
                    path: "$assignedUser",
                    preserveNullAndEmptyArrays: true // If no servicer is found, keep the repair without a servicer
                }
            },
            {
                $unwind: {
                    path: "$assignedTeam",
                    preserveNullAndEmptyArrays: true // If no servicer is found, keep the repair without a servicer
                }
            },
            {
                $unwind: {
                    path: "$asset",
                    preserveNullAndEmptyArrays: true // If no asset is found, keep the repair without an asset
                }
            },
            // {
            //     $addFields: {
            //         "servicers": "$servicerDetails.name" // Assumes the servicer's name is stored under 'name'
            //     }
            // },
            // {
            //     $addFields: {
            //         "asset": "$assetDetails.name" // Assumes the asset's name is stored under 'name'
            //     }
            // },

        ]);
        console.log(repairs)
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
                $match: { status: "Complete" }
            },
            {
                $sort: { createdAt: -1 }
            },
            // {
            //     $addFields: {
            //         dueDate: {
            //             $dateToString: { format: "%Y-%m-%d", date: "$dueDate" }
            //         },
            //         startDate: {
            //             $dateToString: { format: "%Y-%m-%d", date: "$startDate" }
            //         },
            //         completedDate: {
            //             $dateToString: { format: "%Y-%m-%d", date: "$completedDate" }
            //         },
            //     }
            // },
            {
                $lookup: {
                    from: "users", // Replace with the actual collection name of servicers
                    localField: "assignedUser", // Field in the repairs collection
                    foreignField: "_id", // Field in the servicers collection to match on
                    as: "assignedUser" // Where to put the resulting data
                }
            },
            {
                $lookup: {
                    from: "teams", // Replace with the actual collection name of servicers
                    localField: "assignedTeam", // Field in the repairs collection
                    foreignField: "_id", // Field in the servicers collection to match on
                    as: "assignedTeam" // Where to put the resulting data
                }
            },
            {
                $lookup: {
                    from: "assets", // Replace with the actual collection name of assets
                    localField: "asset", // Field in the repairs collection
                    foreignField: "_id", // Field in the assets collection to match on
                    as: "asset" // Where to put the resulting data
                }
            },
            {
                $unwind: {
                    path: "$assignedUser",
                    preserveNullAndEmptyArrays: true // If no servicer is found, keep the repair without a servicer
                }
            },
            {
                $unwind: {
                    path: "$assignedTeam",
                    preserveNullAndEmptyArrays: true // If no servicer is found, keep the repair without a servicer
                }
            },
            {
                $unwind: {
                    path: "$asset",
                    preserveNullAndEmptyArrays: true // If no asset is found, keep the repair without an asset
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
    const { title, asset, startDate, dueDate, priority, assignedUser, assignedTeam, status, cost, description, isFailure, failure, failureDate, failureTitle, failureCause, failureObservation, procedure, procedureTitle, procedureDescription, category } = req.body

    try {
        let roundedCost = null

        if (cost) {
            roundedCost = Math.round(cost * 100) / 100
        }

        let updatedRepair = null

        if (failure) {
            updatedRepair = { title: title, asset: asset, startDate: startDate, dueDate: dueDate, priority: priority, assignedUser: assignedUser, assignedTeam: assignedTeam, status: status, cost: roundedCost, description: description, isFailure: isFailure, failureDate: failureDate, failure: failure, procedure: null, procedureTitle: null, procedureDescription: null }
        }
        else if (failureTitle && failureCause && failureObservation) {
            const categoryExists = await Category.findOne({ _id: ObjectId(category) })

            if (!categoryExists) {
                return res.status(404).json({ error: 'Category does not exist' })
            }

            const observation = failureObservation

            const flaskResponse = await axios.post('http://127.0.0.1:4000/convert-to-dense-vector', { observation })

            const denseVectorOfObservation = flaskResponse.data.dense_vector_of_observation

            let newFailure = null

            if (procedure) {
                newFailure = await Failure.create({ title: failureTitle, observation: failureObservation, denseVectorOfObservation: denseVectorOfObservation, cause: failureCause, procedure: procedure, procedureTitle: null, procedureDescription: null, category: category })
            }
            else if (!procedure && procedureTitle && procedureDescription) {
                newFailure = await Failure.create({ title: failureTitle, observation: failureObservation, denseVectorOfObservation: denseVectorOfObservation, cause: failureCause, procedure: null, procedureTitle: procedureTitle, procedureDescription: procedureDescription, category: category })
            }
            else {
                newFailure = await Failure.create({ title: failureTitle, observation: failureObservation, denseVectorOfObservation: denseVectorOfObservation, cause: failureCause, procedure: null, procedureTitle: null, procedureDescription: null, category: category })
            }

            updatedRepair = { title: title, asset: asset, startDate: startDate, dueDate: dueDate, priority: priority, assignedUser: assignedUser, assignedTeam: assignedTeam, status: status, cost: roundedCost, description: description, isFailure: isFailure, failureDate: failureDate, failure: newFailure._id, procedure: null, procedureTitle: null, procedureDescription: null }
        }
        else if (procedure) {
            updatedRepair = { title: title, asset: asset, startDate: startDate, dueDate: dueDate, priority: priority, assignedUser: assignedUser, assignedTeam: assignedTeam, status: status, cost: roundedCost, description: description, isFailure: isFailure, failureDate: failureDate, failure: null, procedure: procedure, procedureTitle: null, procedureDescription: null }
        }
        else if (procedureTitle && procedureDescription) {
            updatedRepair = { title: title, asset: asset, startDate: startDate, dueDate: dueDate, priority: priority, assignedUser: assignedUser, assignedTeam: assignedTeam, status: status, cost: roundedCost, description: description, isFailure: isFailure, failureDate: failureDate, failure: null, procedure: null, procedureTitle: procedureTitle, procedureDescription: procedureDescription }
        }
        else {
            updatedRepair = { title: title, asset: asset, startDate: startDate, dueDate: dueDate, priority: priority, assignedUser: assignedUser, assignedTeam: assignedTeam, status: status, cost: roundedCost, description: description, isFailure: isFailure, failureDate: failureDate, failure: null, procedure: null, procedureTitle: null, procedureDescription: null }
        }

        const repair = await Repair.findOneAndUpdate({ _id: ObjectId(id) }, { ...updatedRepair }, { new: true })

        res.status(200).json(repair)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const markAsComplete = async (req, res) => {
    const { id } = req.params
    const { oldRepair, status, completedDate } = req.body

    try {
        let updatedRepair = oldRepair

        updatedRepair.status = status
        updatedRepair.completedDate = completedDate

        console.log(updatedRepair)

        const repair = await Repair.findOneAndUpdate({ _id: ObjectId(id) }, { ...updatedRepair }, { new: true })
        res.status(200).json(repair)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

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
    markAsComplete,
    deleteRepair
}