const express = require('express');
const router = express.Router();
const Agent = require('../models/agent');
const jwt = require('jsonwebtoken');

router.post('/add', (req, res) => {
    try {
        const currentDate = new Date(); // Get the current date and time
        req.body.DateEM = currentDate; // Assign the current date to the DateEM field in the request body

        const newAgent = new Agent(req.body);
        newAgent.save();
        res.status(201).json(newAgent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.delete('/delete/:id', async (req, res) => {
  try {
      const deletedAgent = await Agent.findByIdAndDelete(req.params.id);
      if (!deletedAgent) {
          return res.status(404).json({ message: 'Agent not found' });
      }
      res.json({ message: 'Agent deleted successfully', agent: deletedAgent });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// get By ID = 100% working
router.get('/getbyid/:id', (req, res) => {
    let id = req.params.id;
    Agent.findOne({ _id: id }).then(
        (data) => {
            res.send(data);
        },
        (err) => {
            res.send(err);
        }
    );
})
router.get('/getall', (req, res) => {
    Agent.find().then(
        (Etudiant) => {
            res.send(Etudiant)
        },
        (err) => {
            console.log(err);
        }
    )
});
router.put('/update/:id', async (req, res) => {
    try {
      const updatedAgent = await Agent.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // This option returns the updated agent
      });
      if (!updatedAgent) {
        return res.status(404).json({ message: 'Agent not found' });
      }
      res.json(updatedAgent);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  

  router.post('/login', async (req, res) => {
    const { Email, Password } = req.body;
  
    try {
      // Check if the agent with the provided email exists in the database
      const agent = await Agent.findOne({ Email });
  
      if (!agent) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Compare the provided password with the one stored in the database
      if (Password !== agent.Password) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // If the email and password are correct, generate a JWT token without expiration
      const token = jwt.sign(
        { id: agent._id, email: agent.Email , nom: agent.nom }, // Payload data to be encoded in the token
        'your_secret_key' // Replace 'your_secret_key' with a secure secret key for JWT
      );
  
      // Send the token in the response
      res.json({ message: 'Login successful', token: token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  


module.exports = router;
