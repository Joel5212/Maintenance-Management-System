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

//cron job date checks
const cron = require('node-cron');
const moment = require('moment');
const Repair = require('./models/repairModel'); // Adjust the path according to your project structure




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


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to database');

    // Check for overdue repairs immediately after connection is established
    const today = moment().startOf('day');
    try {
      const overdueRepairs = await Repair.updateMany(
        {
          dueDate: { $lt: today.toDate() },
          status: { $ne: 'Overdue' },
          status: { $ne: 'Complete' } // don't update completed repairs

        },
        { $set: { status: 'Overdue' } }
      );

      console.log(`Updated ${overdueRepairs.modifiedCount} repairs to 'Overdue' status.`);
    } catch (err) {
      console.error('Error updating overdue repairs:', err);
    }

    // Listen to port after checking for overdue repairs
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
  console.log('Running a daily check for overdue repairs.');

  try {
    // Current date in 'YYYY-MM-DD' format
    const today = moment().startOf('day');

    // Find repairs where dueDate is before today and status is not 'overdue'
    const overdueRepairs = await Repair.updateMany(
      {
        dueDate: { $lt: today.toDate() },
        status: { $ne: 'Overdue' },
        status: { $ne: 'Complete' } // don't update completed repairs
      },
      {
        $set: { status: 'Overdue' }
      }
    );

    console.log(`Updated ${overdueRepairs.modifiedCount} repairs to 'Overdue' status.`);
  } catch (err) {
    console.error('Error running cron job:', err);
  }
});
