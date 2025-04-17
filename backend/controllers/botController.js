const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
 
const askGemini = async (req, res) => {
    try {
      const { query, data } = req.body;
  
      if (!query || !data) {
        return res.status(400).json({ error: "Query and data are required" });
      }
  
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      // Convert data to readable string format
      const dataString = JSON.stringify(data, null, 2);
      const prompt = `
      I'll be giving some questions and you should answer to it
      and your answer should be related to the query i'm giving 

      data:
      ${dataString}
      
      QUERY: ${query}
      
      Provide your response in a proper format that it should contain only user response`;
  
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      // Get full text content
      const text = response.text();
  
      return res.status(200).json({ answer: text });
    } catch (error) {
      console.error("Gemini API error:", error);
      return res.status(500).json({ error: error.message });
    }
  };

  module.exports={askGemini}