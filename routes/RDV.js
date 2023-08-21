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
    Email,
    dateEmail,
    superficie,
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
    Email,
    dateEmail,
    superficie,
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
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedRDV = await RDV.findByIdAndDelete(req.params.id);
    if (!deletedRDV) {
      return res.status(404).json({ message: 'RDV not found' });
    }
    res.json({ message: 'RDV deleted successfully', agent: deletedRDV });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
const nodemailer = require('nodemailer');
router.put('/update/:id', async (req, res) => {
  try {
    const updatedRDV = await RDV.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // This option returns the updated agent
    });

    if (!updatedRDV) {
      return res.status(404).json({ message: 'RDV not found' });
    }
    if (updatedRDV.Status === "confirmer") {
      sendEmail(updatedRDV);
    }

    res.json(updatedRDV);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

function sendEmail(updatedRDV) {
  const path = require('path');
  const transporter = nodemailer.createTransport({

    service: 'Gmail',
    auth: {
      user: 'renovationglobale.energetique@gmail.com',
      pass: 'qrkakgntphgbnjky',
    },
  });
  const originalDate = new Date(updatedRDV.dateEmail);
  const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric' };
  const formattedDate = originalDate.toLocaleString('fr-FR', options);
  const mailOptions = {
    from: 'renovationglobale.energetique@gmail.com',
    to: updatedRDV.Email,
    subject: 'Confirmation de rendez-vous',
    text: `Cher(e) ${updatedRDV.name} ${updatedRDV.prenom},\n\n` +
      `Suite à notre conversation téléphonique, je suis ravi de vous présenter la société Groupe Innovation Energie.\n\n` +
      `Entreprise spécialisée dans le domaine des énergies renouvelables et de l'isolation. Nous travaillons en partenariat avec des délégataires tels que Total Énergie, et notre mission est de sélectionner les maisons éligibles aux primes CEE (Certificats d'Économie d'Énergie) pour des travaux de rénovation énergétique conformes aux critères établis par ces partenaires et les autorités.\n\n` +
      `Afin de déterminer l'éligibilité de votre maison à cette prime ainsi que le montant auquel vous pourriez prétendre, nous avons besoin de réaliser un audit énergétique.\n\n` +
      `C'est pourquoi je vous propose un rendez-vous avec un technicien de la société SA CONSULTING. Le compte rendu et le relevé qui sera effectué chez vous détermineront le montant de la prime et la prise en charge de la rénovation énergétique de votre maison.\n\n` +
      `Je tiens à vous confirmer que ce rendez-vous est entièrement pris en charge par notre entreprise, et vous n'avez rien à régler.\n\n` +
      `${formattedDate}\n\n` +
      `10 RUE D'ALGER\n` +
      `02100 ST QUENTIN\n\n` +
      `C'est la société AS CONSULTING qui vous contactera 24 heures avant le rendez-vous pour préparer les documents administratifs nécessaires à l'instruction du projet et pour confirmer ce rendez-vous.\n\n` +
      `Veuillez trouver ci-dessous la liste des documents à fournir pour l'instruction du dossier :\n\n` +
      `- Pièce d'identité en cours de validité\n` +
      `- Taxe foncière ou acte notarié\n` +
      `- Avis d'imposition 2022\n\n` +
      `Merci de bien vouloir me confirmer ce rendez-vous par SMS. Je me tiens à votre disposition et vous souhaite une excellente journée.\n\n` +
      `Bien cordialement,\n` +
      `MME SERRIN CAROLE\n` +
      `Projet BAR-TH- P5 Rénovation Globale\n` +
      `GIE / Groupe Innovation Energie\n` +
      `Tel : 01.80.97.77.00\n` +
      `Mob : 07 67 73 77 40\n` +
      `Mail : arielle@gienergie.fr`,
      attachments: [
        {
          filename: 'guide.pdf', 
          path: path.resolve(__dirname, '../file/guide.pdf') 
        }
      ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });

}
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
router.get('/samedate/:date', async (req, res) => {
  const dateToCheck = new Date(req.params.date);

  try {
    // Find all RDVs with the same date
    const count = await RDV.countDocuments({ date: dateToCheck });

    res.json({ date: dateToCheck, count: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get an RDV by status and type
router.get('/getbystatustype/:status/:type', async (req, res) => {
  const status = req.params.status; // Get the status from the URL parameters
  const type = req.params.type; // Get the type from the URL parameters

  try {
    const rdvs = await RDV.find({ Status: status, Type: type });

    if (rdvs.length === 0) {
      return res.status(404).json({ message: `No RDVs found with status: ${status} and type: ${type}` });
    }

    res.json(rdvs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/getbytype/:type', async (req, res) => {// Get the status from the URL parameters
  const type = req.params.type; // Get the type from the URL parameters

  try {
    const rdvs = await RDV.find({ Type: type });

    if (rdvs.length === 0) {
      return res.status(404).json({ message: `No RDVs found with type: ${type}` });
    }

    res.json(rdvs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
