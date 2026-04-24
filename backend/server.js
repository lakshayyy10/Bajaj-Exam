const express = require("express");
const cors = require("cors");
const { analyseEdges } = require("./processor.js");

const app = express();

// cors
app.use(cors());
app.use(express.json());
function extractData(body) {
  if (!body || !Array.isArray(body.data)) {
    return null;
  }
  return body.data;
}
app.post("/bfhl", (req, res) => {
  const payload = extractData(req.body);

  if (!payload) {
    return res.status(400).json({
      success: false,
      message: "Invalid input: expected { data: [] }"
    });
  }
  try {
    const analysis = analyseEdges(payload);
    const response = {
      user_id: "lakshay_15102006",
      email_id: "lc3333@srmist.edu.in",
      college_roll_number: "RA2311003010229",

      hierarchies: analysis.hierarchies,
      invalid_entries: analysis.invalid_entries,
      duplicate_edges: analysis.duplicate_edges,
      summary: analysis.summary
    };

    return res.status(200).json(response);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
});
app.get("/", (_, res) => {
  res.send("BFHL API is running");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server live at http://localhost:${PORT}`);
});
