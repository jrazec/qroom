const { createFile } = require('./../middleware/document');

exports.single = async (req, res) => {
  const { rooms } = req.body;

  try {
    const updatedDocument = await createFile(rooms);
    
    res.json(updatedDocument);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

