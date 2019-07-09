const express = require('express');

const Hubs = require('./hubs-model.js'); // <<< update the path

const router = express.Router();

router.use(express.json());
// for urls beginning with /api/hubs

router.get('/', async (req, res) => {
  try {
    const hubs = await Hubs.find(req.query);
    res.status(200).json(hubs);
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the hubs',
    });
  }
});

router.get('/:id', async (req, res) => {
  console.log(`hit /:id with ${req.id}`);
  try {
    const hub = await Hubs.findById(req.params.id);

    if (hub) {
      res.status(200).json(hub);
    } else {
      res.status(404).json({ message: 'Hub not found' });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the hub',
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const hub = await Hubs.add(req.body);
    res.status(201).json(hub);
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error adding the hub',
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const count = await Hubs.remove(req.params.id);
    if (count > 0) {
      res.status(200).json({ message: 'The hub has been nuked' });
    } else {
      res.status(404).json({ message: 'The hub could not be found' });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error removing the hub',
    });
  }
});

// PUT /api/hubs /:id
router.put('/:id', async (req, res) => {
  try {
    const hub = await Hubs.update(req.params.id, req.body);
    if (hub) {
      res.status(200).json(hub);
    } else {
      res.status(404).json({ message: 'The hub could not be found' });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error updating the hub',
    });
  }
});

// add an endpoint that returns all the messages for a hub
router.get('/:id/messages', (req, res) => {
  console.log('hit /:id/messages');
  const { id } = req.params;

  Hubs.findHubMessages(id)
    .then(messages => {
      if (messages && messages.length) {
        res.status(200).json(messages);
      } else {
        res.status(404).json({ message: 'cannot find it' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/:id/messages', (req, res) => {
  if (!isValidMessage(req.body)) {
    res.status(400).json({ errorMessage: 'bad panda! need sender and text' });
  } else {
    Hubs.addMessage(...req.body)
      .then(result => {
        res.status(201).json(result);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  }
});

function isValidMessage(message) {
  const { sender, text, hub_id } = message;

  return sender && text && hub_id;
}

// add an endpoint for adding new message to a hub
// test it with { hub_id: 1, sender: 'me', text: 'you pick a text' }

module.exports = router;
