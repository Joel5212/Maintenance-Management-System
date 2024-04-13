require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/users')
const teamRoutes = require('./routes/teams')
const assetRoutes = require('./routes/assets')
const categoryRoutes = require('./routes/categories')
const repairProcedureRoutes = require('./routes/repairProcedures')
const preventiveMaintenanceProcedureRoutes = require('./routes/preventiveMaintenanceProcedures')
const organizationRoutes = require('./routes/organization')
const repairRoutes = require('./routes/repairs')
const locationRoutes = require('./routes/locations')
const dashboardRoutes = require('./routes/dashboard')


// express app
const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

//registering users routes
//The app.use() function is used to mount the specified middleware function(s) at the path which is being specified. It is mostly used to set up middleware for your application. 
app.use('/api/users', userRoutes)

app.use('/api/teams', teamRoutes)

app.use('/api/assets', assetRoutes)

app.use('/api/organization', organizationRoutes)

app.use('/api/categories', categoryRoutes)

app.use('/api/repairProcedures', repairProcedureRoutes)

app.use('/api/preventiveMaintenanceProcedures', preventiveMaintenanceProcedureRoutes)

app.use('/api/repairs', repairRoutes)

app.use('/api/locations', locationRoutes)

app.use('/api/dashboard', dashboardRoutes)


// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to database')
    // listen to port
    app.listen(process.env.PORT, () => {
      console.log('listening for requests on port', process.env.PORT)
    })
  })
  .catch((err) => {
    console.log(err)
  })

