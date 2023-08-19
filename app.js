const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost/train-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const companySchema = new mongoose.Schema({
  companyName: String,
  ownerName: String,
  rollNo: String,
  ownerEmail: String,
  accessCode: String,
  clientId: String,
  clientSecret: String,
});

const trainSchema = new mongoose.Schema({
  trainName: String,
  trainNumber: String,
  departureTime: Date,
  availableSeats: {
    sleeper: Number,
    ac: Number,
  },
  price: Number,
});

const Company = mongoose.model('Company', companySchema);
const Train = mongoose.model('Train', trainSchema);

app.use(bodyParser.json());

// Registration route
app.post('/train/register', async (req, res) => {
  const { companyName, ownerName, rollNo, ownerEmail, accessCode } = req.body;

  try {
    const existingCompany = await Company.findOne({ ownerEmail });

    if (existingCompany) {
      return res.status(400).json({ message: 'Company already registered.' });
    }

    const clientId = crypto.randomBytes(8).toString('hex');
    const clientSecret = crypto.randomBytes(16).toString('hex');

    const newCompany = new Company({
      companyName,
      ownerName,
      rollNo,
      ownerEmail,
      accessCode,
      clientId,
      clientSecret,
    });

    await newCompany.save();

    res.json({
      companyName,
      clientId,
      clientSecret,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Authentication route
app.post('/train/auth', async (req, res) => {
  const { clientId, clientSecret } = req.body;

  try {
    const company = await Company.findOne({ clientId, clientSecret });

    if (!company) {
      return res.status(401).json({ message: 'Authentication failed.' });
    }

    res.json({
      companyName: company.companyName,
      ownerName: company.ownerName,
      rollNo: company.rollNo,
      ownerEmail: company.ownerEmail,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Route to get all train details
app.get('/train/trains', async (req, res) => {
  try {
    const trains = await Train.find();

    const trainDetails = trains.map(train => {
      const departureTime = new Date(train.departureTime);
      const departureHours = departureTime.getHours();
      const departureMinutes = departureTime.getMinutes();
      const departureSeconds = departureTime.getSeconds();

      return {
        trainName: train.trainName,
        trainNumber: train.trainNumber,
        departure: {
          hours: departureHours,
          minutes: departureMinutes,
          seconds: departureSeconds,
        },
        availableSeats: train.availableSeats,
        price: train.price,
      };
    });

    res.json(trainDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Route to get details of a single train by train number
app.get('/train/trains/:trainNumber', async (req, res) => {
  const trainNumber = req.params.trainNumber;

  try {
    const train = await Train.findOne({ trainNumber });

    if (!train) {
      return res.status(404).json({ message: 'Train not found.' });
    }

    const departureTime = new Date(train.departureTime);
    const departureHours = departureTime.getHours();
    const departureMinutes = departureTime.getMinutes();
    const departureSeconds = departureTime.getSeconds();

    const trainDetails = {
      trainName: train.trainName,
      trainNumber: train.trainNumber,
      departure: {
        hours: departureHours,
        minutes: departureMinutes,
        seconds: departureSeconds,
      },
      availableSeats: train.availableSeats,
      price: train.price,
    };

    res.json(trainDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
