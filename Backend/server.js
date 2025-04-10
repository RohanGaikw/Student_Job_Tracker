const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {

})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Job Schema
const jobSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
    default: 'Applied'
  },
  appliedDate: { type: Date, required: true },
  link: { type: String },

  // 🔗 Add this to track the logged-in student
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Job = mongoose.model('Job', jobSchema);



const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});

const User = mongoose.model('User', userSchema);


// ✅ Must be under "/auth/register"
app.post('/register', async (req, res) => {
  console.log("Register Request:", req.body); // ✅ Add this

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const hashedPass = await bcrypt.hash(password, 10);

  try {
    await User.create({ name, email, password: hashedPass });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Email already exists or invalid input' });
  }
});

// Login
app.post('/login', async (req, res) => {
  console.log("Login Request:", req.body);

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid password' });

    // ✅ Respond if login successful
    res.status(200).json({
      message: 'Login successful',
      user: { _id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong during login' });
  }
});


// 🎯 1. Add Job Application
app.post('/jobs', async (req, res) => {
  try {
    const { company, role, status, appliedDate, createdBy, link } = req.body;

    const job = new Job({
      company,
      role,
      status,
      appliedDate,
      link,
      createdBy  // ✅ should match schema
    });

    const savedJob = await job.save();
    res.status(201).json(savedJob);
  } catch (err) {
    console.error("Error adding job:", err);
    res.status(500).json({ error: err.message });
  }
});



// 🎯 2. List All Applications (with optional filtering)
app.get('/jobs', async (req, res) => {
  const { createdBy, status, date } = req.query;
  let filter = {};

  if (createdBy) filter.createdBy = createdBy;
  if (status) filter.status = status;
  if (date) filter.appliedDate = { $gte: new Date(date) };

  try {
    const jobs = await Job.find(filter);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// 🎯 3. Update Job Status
app.put('/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🎯 4. Delete Job Application
app.delete('/jobs/:jobId', async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.jobId);
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the Student Job Tracker API!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
