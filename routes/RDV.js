const express = require('express');
const router = express.Router();
const RDV = require('../models/RDV');

router.post('/add', (req, res) => {
  const currentDate = new Date(); // Get the current date and time

  const {
    name,
    prenom,
    date,
    Type,
    Adresse,
    Ville,
    CP,
    NumFix,
    NumPor,
    TypeChauf,
    Propriatire,
    NombrePer,
    RevenuCli,
    NumeroFisc,
    ReferenceAvis,
    Precarite,
    CommentaireAg,
    CommentaireAd,
    idAgent,
  } = req.body;

  const event = new RDV({
    name,
    prenom,
    date,
    Type,
    Adresse,
    Ville,
    CP,
    NumFix,
    NumPor,
    TypeChauf,
    Propriatire,
    NombrePer,
    RevenuCli,
    NumeroFisc,
    ReferenceAvis,
    Precarite,
    CommentaireAg,
    Status: 'en cours', // Set the Status field to "en cours" by default
    CommentaireAd,
    PriseLe: currentDate, // Set the PriseLe field to the current date
    idAgent,
  });

  try {
    event.save();
    res.json({ message: 'Event saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving event' });
  }
});

router.get('/getall', async (req, res) => {
  try {
    const events = await RDV.find({});
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving events' });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const updatedRDV = await RDV.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // This option returns the updated agent
    });

    if (!updatedRDV) {
      return res.status(404).json({ message: 'RDV not found' });
    }

    res.json(updatedRDV);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/getbyidagent/:id', (req, res) => {
  let idAgent = req.params.id; // Use req.params.id to get the idAgent parameter
  RDV.find({ idAgent: idAgent }) // Find all RDVs with the specified idAgent
    .then((data) => {
      if (data.length === 0) {
        return res.status(404).json({ message: 'No RDVs found for the given idAgent' });
      }
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get('/count/:idAgent/:status', async (req, res) => {
  const idAgent = req.params.idAgent; // Get the agent ID parameter from the URL
  const status = req.params.status; // Get the status parameter from the URL

  try {
    const count = await RDV.countDocuments({ idAgent: idAgent, Status: status });

    if (count === 0) {
      return res.status(404).json({ message: `No RDVs found for the agent with status: ${status}` });
    }

    res.json({ agentId: idAgent, status: status, count: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/check-date-availability/:date', async (req, res) => {
  const dateToCheck = new Date(req.params.date);

  try {
    // Check if there is any RDV with the same date
    const existingRDV = await RDV.findOne({ date: dateToCheck });

    if (existingRDV) {
      // If an RDV with the same date is found, the date is not available
      res.json({ available: false });
    } else {
      // If no RDV with the same date is found, the date is available
      res.json({ available: true });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/getbyid/:id', (req, res) => {
  let id = req.params.id;
  RDV.findOne({ _id: id }).then(
    (data) => {
      res.send(data);
    },
    (err) => {
      res.send(err);
    }
  );
})
router.get('/getencours', async (req, res) => {
  const status = 'en cours'; // Set the status to filter RDVs

  try {
    const enCoursRDVs = await RDV.find({ Status: status });

    if (enCoursRDVs.length === 0) {
      return res.status(404).json({ message: 'No RDVs found with status "en cours"' });
    }

    res.json(enCoursRDVs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/getwithstatus/:status', async (req, res) => {
  const status = req.params.status; // Get the status from the params

  try {
    const rdvs = await RDV.find({ Status: status });

    if (rdvs.length === 0) {
      return res.status(404).json({ message: `No RDVs found with status: ${status}` });
    }

    res.json(rdvs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
