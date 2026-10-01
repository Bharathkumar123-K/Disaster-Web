const { faker } = require('@faker-js/faker');
const RawPost = require('../models/RawPost');
const { processRawPost } = require('../ai/mockEngine');
let ioInstance = null;

function setIo(io) {
  ioInstance = io;
}

async function simulateIncomingData() {
  try {
    const rawPost = await RawPost.create({
      source: faker.helpers.arrayElement(['Twitter', 'Reddit', 'NewsAPI', 'ReliefWeb']),
      sourceId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      text: faker.lorem.paragraph(),
      rawTimestamp: new Date(),
      processed: true
    });

    // Send through AI pipeline
    const { classified, recommendation } = await processRawPost(rawPost);

    console.log(`[Ingestion] New event classified: ${classified.category} - ${classified.severity}`);

    // Emit via Socket.io
    if (ioInstance) {
      ioInstance.emit('event:new', { event: classified, recommendation });
    }
  } catch (error) {
    console.error('[Ingestion] Error simulating data:', error);
  }
}

module.exports = { simulateIncomingData, setIo };
