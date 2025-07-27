const express = require('express');
const router = express.Router();
const Diary = require('../models/Diary');
const authMiddleware = require('../middleware/auth');

// 👉 Create Diary Entry
router.post('/create', authMiddleware, async (req, res) => {
  const { title, content, date } = req.body;
  console.log("📥 Received Create Request:", req.body);
  const createdAt = date ? new Date(date) : new Date();
  try {
    const newEntry = new Diary({
      user: req.user,
      title,
      content,
      createdAt,
    });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Create Entry Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 👉 Get Diary Entries for a Specific Date
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user;
  const rawDate = new Date(req.query.date);

  const startOfDay = new Date(rawDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(rawDate);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const entries = await Diary.find({
      user: userId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ createdAt: -1 });

    res.status(200).json(entries);
  } catch (error) {
    console.error('Fetch Entries Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 👉 Delete Entry by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const entry = await Diary.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.error('Delete Entry Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 👉 Update Diary Entry
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  try {
    const updatedEntry = await Diary.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { title, content },
      { new: true }
    );
    if (!updatedEntry) return res.status(404).json({ message: "Entry not found" });
    res.status(200).json(updatedEntry);
  } catch (error) {
    console.error('Update Entry Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// 👉 Get all entries for a month (for calendar dots)
router.get('/month', authMiddleware, async (req, res) => {
  try {
    const { year, month } = req.query; // month 1-12
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const entries = await Diary.find({
      user: req.user,
      createdAt: { $gte: start, $lt: end },
    }).select('createdAt');

    res.json(entries);
  } catch (error) {
    console.error('Fetch Month Entries Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

