require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const { simulateIncomingData, setIo } = require('./ingestion/mockIngestion');
const eventsRouter = require('./routes/events');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.set('socketio', io);

const adminRouter = require('./routes/admin');
const citizenRouter = require('./routes/citizen');
app.use('/api/events', eventsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/citizen', citizenRouter);

// Socket connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

setIo(io);

async function startServer() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/realtime_disaster';
    
    await mongoose.connect(mongoUri);
    console.log(`Connected to Local MongoDB at ${mongoUri}`);

    // Clean up old non-India mock events
    const ClassifiedEvent = require('./models/ClassifiedEvent');
    await ClassifiedEvent.deleteMany({ 'location.coordinates.0': { $lt: 0 } });

    // Seed initial Indian events if empty
    const count = await ClassifiedEvent.countDocuments();
    if (count < 5) {
      for (let i = 0; i < 8; i++) {
        await simulateIncomingData();
      }
    }

    // Generate mock data every 10 seconds
    setInterval(() => {
      simulateIncomingData();
    }, 10000);

    server.listen(PORT, () => {
      console.log(`Backend server + Socket.io running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
