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

    console.log(completedFailureReportForEachAsset)

    let totalTimeBetweenFailures = 0
    let overlapCount = 0;
    let i = 0

    for (const completedFailureReportForAsset of completedFailureReportForEachAsset) {
        if (completedFailureReportForAsset.length != 1) {
            while (i < completedFailureReportForAsset.startAndEndDates.length - 1) {
                let completedDate = completedFailureReportForAsset.startAndEndDates[i].completedDate
                let startDateOfNextFailure = completedFailureReportForAsset.startAndEndDates[i + 1].startDate;
                console.log("COMPLETED DATE", completedDate)
                console.log("START DATE OF NEXT FAILURE", startDateOfNextFailure)
                if (completedDate < startDateOfNextFailure) {
                    totalTimeBetweenFailures += startDateOfNextFailure - completedDate;
                }
                else {
                    overlapCount++
                }
                i += 1
            }
        }
        let mtbf = (totalTimeBetweenFailures / 3600000) / (completedFailureReportForAsset.totalFailures - overlapCount);
        mtbf = Math.round(mtbf * 100) / 100
        completedFailureReportForAsset.mtbf = mtbf;
    }

    res.status(200).json(completedFailureReportForEachAsset);
}

const getUsersPerformanceReportForRepairs = async (req, res) => {
    const usersPerformanceReport = await Repair.aggregate([
        {
            $match: {
                status: "Complete",
                assignedUser: { $ne: null }
            },
        },
        {
            $group: {
                _id: "$assignedUser",
                totalRepairs: { $sum: 1 },
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
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
            },

        },
        {
            $project: {
                _id: 1,
                totalRepairs: 1,
                startAndEndDates: 1,
                user: "$user.name"
            }
        }
    ])

    let totalTimeBetweenRepairs = 0
    let i = 0

    for (const userPerformanceReport of usersPerformanceReport) {
        while (i < userPerformanceReport.startAndEndDates.length) {
            let completedDate = userPerformanceReport.startAndEndDates[i].completedDate
            let startDate = userPerformanceReport.startAndEndDates[i].startDate;
            totalTimeBetweenRepairs += completedDate - startDate;
            i += 1
        }

        console.log(totalTimeBetweenRepairs)

        let mtfr = (totalTimeBetweenRepairs / 3600000) / userPerformanceReport.totalRepairs;
        mtfr = Math.round(mtfr * 100) / 100
        userPerformanceReport.mtfr = mtfr;
    }

    console.log(usersPerformanceReport)

    res.status(200).json(usersPerformanceReport);
}

const getTeamsPerformanceReportForRepairs = async (req, res) => {
    const teamsPerformanceReport = await Repair.aggregate([
        {
            $match: {
                status: "Complete",
                assignedTeam: { $ne: null }
            },
        },
        {
            $group: {
                _id: "$assignedTeam",
                totalRepairs: { $sum: 1 },
                startAndEndDates: {
                    $push:
                    {
                        startDate: "$startDate",
                        completedDate: "$completedDate",
                    }
                }
            },
        },
        {
            $lookup: {
                from: 'teams',
                localField: '_id',
                foreignField: '_id',
                as: 'team'
            },
        },
        {
            $project: {
                _id: 1,
                totalRepairs: 1,
                startAndEndDates: 1,
                team: "$team.name"
            }
        }
    ])

    let totalTimeBetweenRepairs = 0
    let i = 0

    for (const teamPerformanceReport of teamsPerformanceReport) {
        while (i < teamPerformanceReport.startAndEndDates.length) {
            let completedDate = teamPerformanceReport.startAndEndDates[i].completedDate
            let startDate = teamPerformanceReport.startAndEndDates[i].startDate;
            totalTimeBetweenRepairs += completedDate - startDate;
            i += 1
        }
        let mtfr = (totalTimeBetweenRepairs / 3600000) / teamPerformanceReport.totalRepairs;
        mtfr = Math.round(mtfr * 100) / 100
        teamPerformanceReport.mtfr = mtfr;
    }

    res.status(200).json(teamsPerformanceReport);
}




// const getPreventiveMaintenanceStats = async (req, res) => {
//     const incompletePreventiveMaintenancesCount = PreventiveMaintenance.find({ status: "Incomplete" }).count()
//     const completedPreventiveMaintenancesCount = PreventiveMaintenance.find({ status: "Complete" }).count()
//     const overduePreventiveMaintenancesCount = PreventiveMaintenance.find({ status: "Overdue" }).count()

//     res.status(200).json([incompletePreventiveMaintenancesCount, completedPreventiveMaintenancesCount, overduePreventiveMaintenancesCount])
// }

module.exports = { getRepairStatusStats, getRepairPriorityStats, getRepairFailureReport, getUsersPerformanceReportForRepairs, getTeamsPerformanceReportForRepairs }

