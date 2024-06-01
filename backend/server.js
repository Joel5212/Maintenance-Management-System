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
const preventiveMaintenanceRoutes = require('./routes/preventiveMaintenance')
const locationRoutes = require('./routes/locations')
const failureRoutes = require('./routes/failures')
const dashboardRoutes = require('./routes/dashboard')

//cron job date checks
const cron = require('node-cron');
const moment = require('moment-timezone');
const Repair = require('./models/repairModel');
const PreventiveMaintenance = require('./models/preventiveMaintenanceModel');




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

app.use('/api/repair-procedures', repairProcedureRoutes)

app.use('/api/preventive-maintenance-procedures', preventiveMaintenanceProcedureRoutes)

app.use('/api/repairs', repairRoutes)

app.use('/api/preventiveMaintenances', preventiveMaintenanceRoutes)

app.use('/api/locations', locationRoutes)

app.use('/api/failures', failureRoutes)

app.use('/api/dashboard', dashboardRoutes)


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to database');
    const today = moment().utc().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[+00:00]');
    console.log(today);
    try {
      const overdueRepairs = await Repair.updateMany(
        { status: "Incomplete", dueDate: { $lt: today } },
        { $set: { status: 'Overdue' } }
      );
      console.log(`Updated ${overdueRepairs.modifiedCount} repairs to 'Overdue' status.`);

      const overdueMaintenances = await PreventiveMaintenance.updateMany(
        { status: "Incomplete", dueDate: { $lt: today } },
        { $set: { status: 'Overdue' } }
      );
      console.log(`Updated ${overdueMaintenances.modifiedCount} preventive maintenances to 'Overdue' status.`);
    } catch (err) {
      console.error('Error updating documents:', err);
    }

    // Listen to port after checking for overdue documents
    app.listen(process.env.PORT, () => {
      console.log('Listening for requests on port', process.env.PORT);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });
// Cron job to check for overdue repairs every day at midnight (00:00)
// Time syntax: ('Minute Hour * * *') using 24 hr clock
cron.schedule('0 0 * * *', async () => {
  console.log('Running a daily check for overdue repairs and preventive maintenances.');

  try {
    const today = moment().utc().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[+00:00]');

    // Updating overdue repairs
    const overdueRepairs = await Repair.updateMany(
      { status: "Incomplete", dueDate: { $lt: today } },
      { $set: { status: 'Overdue' } }
    );
    console.log(`Updated ${overdueRepairs.modifiedCount} repairs to 'Overdue' status.`);

    // Updating overdue preventive maintenances
    const overdueMaintenances = await PreventiveMaintenance.updateMany(
      { status: "Incomplete", dueDate: { $lt: today } },
      { $set: { status: 'Overdue' } }
    );
    console.log(`Updated ${overdueMaintenances.modifiedCount} preventive maintenances to 'Overdue' status.`);
  } catch (err) {
    console.error('Error running cron job:', err);
  }
});
