require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000, // 30s timeout
    connectTimeoutMS: 30000,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const eventSchema = new mongoose.Schema({
  title: String,
  category: String,
  start: Date,
  end: Date,
  color: String,
  notification: String, // Stores predefined options or custom datetime as string
  allDay: Boolean,
  repeat: String,
  location: String,
});

const Event = mongoose.model('Event', eventSchema);

// GET all events
app.get('/api/events', async (req, res) => {
  try {
    console.log('Fetching events from MongoDB...');
    const events = await Event.find();
    console.log('Events fetched:', events);
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST new event
app.post('/api/events', async (req, res) => {
  try {
    console.log('Creating event:', req.body);
    const event = new Event(req.body);
    await event.save();
    res.json(event);
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT update event
app.put('/api/events/:id', async (req, res) => {
  try {
    console.log('Updating event:', req.params.id);
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(event);
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE event
app.delete('/api/events/:id', async (req, res) => {
  try {
    console.log('Deleting event:', req.params.id);
    await Event.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));