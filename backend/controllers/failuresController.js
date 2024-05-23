const Failure = require('../models/failureModel')
const Category = require('../models/categoryModel')
const mongoose = require('mongoose')
const { ObjectId } = require('mongodb');
const io = require('socket.io-client')
const socket = io('http://localhost:4000')
const axios = require('axios');

const createFailure = async (req, res) => {
    try {
        const { title, observation, cause, procedure, procedureTitle, procedureDescription, category } = req.body

        let failure = null

        const categoryExists = await Category.findOne({ _id: ObjectId(category) })

        if (!categoryExists) {
            res.status(404).json({ error: 'Category does not exist' })
        }

        const flaskResponse = await axios.post('http://127.0.0.1:4000/convert-to-dense-vector', { observation })

        const denseVectorOfObservation = flaskResponse.data.dense_vector_of_observation

        if (procedure) {
            failure = await Failure.create({ title: title, observation: observation, denseVectorOfObservation: denseVectorOfObservation, cause: cause, procedure: procedure, procedureTitle: null, procedureDescription: null, category: category })
        }
        else if (!procedure && procedureTitle && procedureDescription) {
            failure = await Failure.create({ title: title, observation: observation, denseVectorOfObservation: denseVectorOfObservation, cause: cause, procedure: null, procedureTitle: procedureTitle, procedureDescription: procedureDescription, category: category })
        }
        else {
            failure = await Failure.create({ title: title, observation: observation, denseVectorOfObservation: denseVectorOfObservation, cause: cause, procedure: null, procedureTitle: null, procedureDescription: null, category: category })
        }

        res.status(200).json(failure);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getFailures = async (req, res) => {
    const { id } = req.params

    const failures = await Failure.find({ category: id }, { denseVectorOfObservation: 0 }).populate({
        path: "procedure"
    }).sort({ createdAt: -1 })

    res.status(200).json(failures)
}

const getFailure = async (req, res) => {
    const { id } = req.params

    const failure = await Failure.findOne({ _id: id }).populate({ path: "procedure" })

    res.status(200).json(failure)
}

const getSimilarFailures = async (req, res) => {
    const { observationQuery, category } = req.body
    console.log("HELLO")
    const flaskResponse = await axios.post('http://127.0.0.1:4000/get-similar-failures', { observationQuery, category })
    const similarFailures = flaskResponse.data.similar_failures

    const allDataOfSimilarFailures = []

    for (const similarFailure of similarFailures) {

        const failure = await Failure.findOne({ _id: ObjectId(similarFailure._id) }, { denseVectorOfObservation: 0 }).populate({
            path: "procedure"
        }).sort({ createdAt: -1 })

        allDataOfSimilarFailures.push(failure)
    }

    console.log(allDataOfSimilarFailures)

    res.status(200).json(allDataOfSimilarFailures)
}

const deleteFailure = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Error' })
    }

    const failureExists = await Failure.findOne({ _id: id })

    if (!failureExists) {
        return res.status(404).json({ error: 'No such Failure' })
    }

    const failure = await Failure.findOneAndDelete({ _id: id })

    if (!failure) {
        return res.status(404).json({ error: 'Error' })
    }

    res.status(200).json(failure)
}

const updateFailure = async (req, res) => {
    try {

        const { title, observation, cause, procedure, procedureTitle, procedureDescription, category } = req.body

        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Error' })
        }

        let updatedFailure = null

        const categoryExists = await Category.findOne({ _id: ObjectId(category) })

        if (!categoryExists) {
            return res.status(404).json({ error: 'No such Category' })
        }

        const failureExists = await Failure.findOne({ _id: ObjectId(id) })

        if (!failureExists) {
            return res.status(404).json({ error: 'No such Failure' })
        }

        const flaskResponse = await axios.post('http://127.0.0.1:4000/convert-to-dense-vector', { observation })

        const denseVectorOfObservation = flaskResponse.data.dense_vector_of_observation

        if (procedure) {
            updatedFailure = { title: title, observation: observation, denseVectorOfObservation: denseVectorOfObservation, cause: cause, procedure: ObjectId(procedure), procedureTitle: null, procedureDescription: null, category: ObjectId(category) }
        }
        else if (!procedure && procedureTitle && procedureDescription) {
            updatedFailure = { title: title, observation: observation, denseVectorOfObservation: denseVectorOfObservation, cause: cause, procedure: null, procedureTitle: procedureTitle, procedureDescription: procedureDescription, category: ObjectId(category) }
        }
        else {
            updatedFailure = { title: title, observation: observation, denseVectorOfObservation: denseVectorOfObservation, cause: cause, procedure: null, procedureTitle: null, procedureDescription: null, category: ObjectId(category) }
        }

        const failure = await Failure.findOneAndUpdate({ _id: ObjectId(id) }, { ...updatedFailure }, { new: true })

        if (!failure) {
            return res.status(404).json({ error: 'Error' })
        }

        res.status(200).json(failure)
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { createFailure, getFailures, getFailure, getSimilarFailures, updateFailure, deleteFailure }