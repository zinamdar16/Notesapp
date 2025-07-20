const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/notesdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Note schema
const Note = mongoose.model('Note', new mongoose.Schema({
  content: String,
}));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Get all notes
app.get('/api/notes', async (req, res) => {
  const notes = await Note.find().sort({ _id: -1 });
  res.json(notes);
});

// Get a single note by ID
app.get('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(400).json({ message: 'Invalid note ID' });
  }
});

// Create a note
app.post('/api/notes', async (req, res) => {
  const { content } = req.body;
  const note = new Note({ content });
  await note.save();
  res.json(note);
});

// Update a note
app.put('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const updated = await Note.findByIdAndUpdate(id, { content }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Note not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Invalid note ID' });
  }
});

// Delete a note
app.delete('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Note.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid note ID' });
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

