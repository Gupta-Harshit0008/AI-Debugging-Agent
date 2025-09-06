const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const dotenv=require('dotenv')

dotenv.config({path:'./config.env'})
console.log("Gemini API Key:", process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



exports.searchStackOverflow = async (query, maxResults = 3) => {
  try {
    const url = `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&pagesize=${maxResults}&q=${encodeURIComponent(query)}&site=stackoverflow`;
    const res = await axios.get(url);
    return res.data.items?.map(i => ({ title: i.title, link: i.link })) || [];
  } catch (err) {
    console.error("SO Search error:", err.message);
    return [];
  }
};

exports.searchGitHub = async (query, maxResults = 3) => {
  try {
    const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=${maxResults}`;
    const res = await axios.get(url, { headers: { "User-Agent": "debug-agent" } });
    return res.data.items?.map(i => ({ title: i.title, link: i.html_url })) || [];
  } catch (err) {
    console.error("GH Search error:", err.message);
    return [];
  }
};

exports.handleDebugQuery = async (conversation) => {
  const lastMessage = conversation.slice(-1)[0].content;

  const [soResults, ghResults] = await Promise.all([
    exports.searchStackOverflow(lastMessage),
    exports.searchGitHub(lastMessage)
  ]);

  const history = conversation.map(m => `${m.role}: ${m.content}`).join("\n");

  const sourcesText = [
    "**StackOverflow Results:**",
    soResults.length ? soResults.map(s => `- ${s.title}: ${s.link}`).join("\n") : "- None",
    "**GitHub Results:**",
    ghResults.length ? ghResults.map(s => `- ${s.title}: ${s.link}`).join("\n") : "- None"
  ].join("\n");

  const prompt = `
You are an expert MEAN stack debugging assistant.
User error message: ${lastMessage}

Conversation history:
${history}

External resources:
${sourcesText}

Please provide a detailed step-by-step debugging guide. Include commands to run, reasoning, and references from the sources above.
`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  const aiText = result?.response?.text() || "Sorry, I couldn't find a solution.";

  return { text: aiText, sources: { stackoverflow: soResults, github: ghResults } };
};
