const express = require('express');
const app = express();
const cors = require('cors');
require('./Config/DB_Config');
app.use(express.json());
app.use(cors());
const RDVAPI = require('./routes/RDV');
const AgentApi = require('./routes/agent');
app.use('/RDV', RDVAPI);
app.use('/Agent', AgentApi);
app.listen(3000, () => {
    console.log('server works!');
})

