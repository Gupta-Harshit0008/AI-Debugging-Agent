const express= require('express');
const cors = require('cors');
const { handleDebugQuery } = require('./utils/agent');
const dotenv=require('dotenv')
const morgan = require('morgan');




const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
dotenv.config({path:'./config.env'})

let sessions = {};

const mainController = async (req, res) => {
  const { sessionId, message } = req.body;
  if (!sessionId || !message) return res.status(400).json({ error: "sessionId and message required" });

  if (!sessions[sessionId]) sessions[sessionId] = [];
  sessions[sessionId].push({ role: "user", content: message });

  try {
    const result = await handleDebugQuery(sessions[sessionId]);
    sessions[sessionId].push({ role: "assistant", content: result.text });

    res.json({
      reply: result.text,
      sources: result.sources
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

app.post("/api/debug",mainController );


module.exports=app;
