const Repair = require('../models/repairModel')
// const PreventiveMaintenance = require('../models/preventiveMaintenanceModel')
const mongoose = require('mongoose');

// const getUpcomingRepairs = async (req, res) => {


//     //dates are saved in miliseconds
//     const currentDate = new Date();

//     const daysBeforeDueDate = 7;

//     const dueDateCriteria = {
//         $gte: new Date(currentDate.getTime() + (daysBeforeDueDate * 24 * 60 * 60 * 1000)),
//         // $lt: new Date(currentDate.getTime() + 1 + (daysBeforeDueDate * 24 * 60 * 60 * 1000))
//     };

//     const repairs = Repair.find({ dueDate: dueDateCriteria });

//     res.status(200).json(repairs)
// }

// const getUpcomingPreventiveMaintenances = async (req, res) => {
//     const currentDate = new Date();

//     const daysBeforeDueDate = 7;

//     const dueDateCriteria = {
//         $gte: new Date(currentDate.getTime() + (daysBeforeDueDate * 24 * 60 * 60 * 1000)),
//         // $lt: new Date(currentDate.getTime() + 1 + (daysBeforeDueDate * 24 * 60 * 60 * 1000))
//     };

//     const preventiveMaintenances = PreventiveMaintenance.find({ dueDate: dueDateCriteria });

//     res.status(200).json(preventiveMaintenances)
// }

const getRepairStatusStats = async (req, res) => {
    const incompleteRepairsCount = await Repair.find({ status: "Incomplete" }).count()
    const completedRepairsCount = await Repair.find({ status: "Complete" }).count()
    const overdueRepairsCount = await Repair.find({ status: "Overdue" }).count()

    res.status(200).json({ incompleteRepairsCount, completedRepairsCount, overdueRepairsCount })
}

const getRepairPriorityStats = async (req, res) => {
    const lowPriorityRepairs = await Repair.find({
        $and: [{ priority: "Low" }, { $or: [{ status: "Incomplete" }, { status: "Overdue" }] }]
    }).count()

    const mediumPriorityRepairs = await Repair.find({
        $and: [{ priority: "Medium" }, { $or: [{ status: "Incomplete" }, { status: "Overdue" }] }]
    }).count()

    const highPriorityRepairs = await Repair.find({
        $and: [{ priority: "High" }, { $or: [{ status: "Incomplete" }, { status: "Overdue" }] }]
    }).count()

    res.status(200).json({ lowPriorityRepairs, mediumPriorityRepairs, highPriorityRepairs })
}

const getRepairFailureReport = async (req, res) => {
    // const totalFailuresForEachAsset = await Repair.aggregate([
    //     {
    //         $match: {
    //             isFailure: true
    //         },
    //     },
    //     {
    //         $group: {
    //             _id: "$asset",
    //             totalFailures: { $sum: 1 }
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: 'assets',
    //             localField: '_id',
    //             foreignField: '_id',
    //             as: 'asset'
    //         }
    //     },
    //     {
    //         $project: {
    //             _id: 1,
    //             totalFailures: 1,
    //             asset: "$asset.name"
    //         }
    //     }
    // ])

    const completedFailureReportForEachAsset = await Repair.aggregate([
        {
            $match: {
                isFailure: true,
                status: "Complete"
            }
        },
        {
            $sort: {
                startDate: 1
            }
        },
        {
            $group: {
                _id: "$asset",
                totalFailures: { $sum: 1 },
                startAndEndDates: {
                    $push:
                    {
                        startDate: "$startDate",
                        completedDate: "$completedDate",
                    }
                }
            }
        },
        {
            $lookup: {
                from: 'assets',
                localField: '_id',
                foreignField: '_id',
                as: 'asset'
            }
        },
        {
            $project: {
                _id: 1,
                totalFailures: 1,
                startAndEndDates: 1,
                asset: "$asset.name"
            }
        }
    ])

    let totalTimeBetweenFailures = 0
    let overlap = false;
    let overlapCount = 0;
    let i = 0

    for (const completedFailureReportForAsset of completedFailureReportForEachAsset) {
        if (completedFailureReportForAsset.length != 1) {
            while (i < completedFailureReportForAsset.startAndEndDates.length - 1) {
                let completedDate = completedFailureReportForAsset.startAndEndDates[i].completedDate
                let startDateOfNextFailure = completedFailureReportForAsset.startAndEndDates[i + 1].startDate;
                if (completedDate < startDateOfNextFailure) {
                    totalTimeBetweenFailures += startDateOfNextFailure - completedDate;
                }
                else {
                    overlapCount++
                }
                i += 1
            }
        }
        const mtbf = (totalTimeBetweenFailures / 3600000) / (completedFailureReportForAsset.totalFailures - overlapCount);

        completedFailureReportForAsset.mtbf = mtbf;
    }

    res.status(200).json(completedFailureReportForEachAsset);
}

// const getPreventiveMaintenanceStats = async (req, res) => {
//     const incompletePreventiveMaintenancesCount = PreventiveMaintenance.find({ status: "Incomplete" }).count()
//     const completedPreventiveMaintenancesCount = PreventiveMaintenance.find({ status: "Complete" }).count()
//     const overduePreventiveMaintenancesCount = PreventiveMaintenance.find({ status: "Overdue" }).count()

//     res.status(200).json([incompletePreventiveMaintenancesCount, completedPreventiveMaintenancesCount, overduePreventiveMaintenancesCount])
// }

module.exports = { getRepairStatusStats, getRepairPriorityStats, getRepairFailureReport }

