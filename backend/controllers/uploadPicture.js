const con = require("../config/db");

exports.uploadPicture = (req, res) => {
  const { user_name } = req.body;
  const picture = req.file.filename;

  if (!picture) return res.status(400).json({ message: "No picture uploaded" });

  con.query("UPDATE users SET image = ? WHERE user_name = ?", [picture, user_name], (error) => {
    if (error) return res.status(500).json({ message: "Database error", error });
    res.json({ message: "Picture uploaded successfully", imageUrl: `/uploads/${picture}` });
  });
};
