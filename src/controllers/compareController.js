// src/controllers/compareController.js
const CompareModel = require("../models/compareModel");

function parseHp(power) {
  if (!power) return 0;
  const match = power.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

exports.add = async (req, res) => {
  try {
    const sessionId = req.headers["x-session-id"];
    const { car_id } = req.body;

    if (!sessionId || !car_id) {
      return res.status(400).json({ error: "Missing data" });
    }

    const result = await CompareModel.add(sessionId, car_id);

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    res.json({ selectedCars: result.selected });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getSelected = async (req, res) => {
  try {
    const sessionId = req.headers["x-session-id"];
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID missing" });
    }

    const selected = await CompareModel.getSelected(sessionId);
    res.json({ selectedCars: selected });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch selected cars" });
  }
};

exports.reset = async (req, res) => {
  try {
    const sessionId = req.headers["x-session-id"];
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID missing" });
    }

    await CompareModel.reset(sessionId);
    res.json({ message: "Comparison reset" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Reset failed" });
  }
};

exports.summary = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || ids.length !== 2) {
      return res.status(400).json({ error: "Select exactly 2 cars" });
    }

    const cars = await CompareModel.getCarsByIds(ids);

    const enriched = cars.map(c => ({
      ...c,
      hpValue: parseHp(c.power)
    }));

    const sorted = [...enriched].sort((a, b) => b.hpValue - a.hpValue);

    res.json({
      cars: enriched,
      stats: {
        maxHpValue: sorted[0].hpValue,
        minHpValue: sorted[1].hpValue,
        hpDifference: Math.abs(sorted[0].hpValue - sorted[1].hpValue),
        maxHpCars: enriched.filter(c => c.hpValue === sorted[0].hpValue),
        minHpCars: enriched.filter(c => c.hpValue === sorted[1].hpValue),
        sortedByHpDesc: sorted
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate summary" });
  }
};
