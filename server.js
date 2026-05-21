const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// ডাটাবেস কানেকশন (আপাতত লোকাল, পরে আমরা MongoDB Atlas দেব)
mongoose.connect('mongodb://localhost:27017/tradingGame', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Database Connected!"))
  .catch(err => console.log("DB Error: " + err));

// গেম রেজাল্ট স্কিমা (অ্যাডমিন যা সেট করবে)
const ResultSchema = new mongoose.Schema({
    nextResult: String, // 'Red' or 'Green'
    adminNumber: String
});
const Result = mongoose.model('Result', ResultSchema);

// অ্যাডমিন প্যানেল থেকে নম্বর এবং রেজাল্ট চেঞ্জ করার API
app.post('/api/admin/update', async (req, res) => {
    const { nextResult, adminNumber } = req.body;
    let data = await Result.findOne();
    if (!data) data = new Result();
    
    if(nextResult) data.nextResult = nextResult;
    if(adminNumber) data.adminNumber = adminNumber;
    
    await data.save();
    res.json({ message: "Updated Successfully!" });
});

// গেম পেজে ডাটা পাঠানোর API
app.get('/api/game/data', async (req, res) => {
    const data = await Result.findOne();
    res.json(data || { nextResult: 'Wait', adminNumber: 'Not Set' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

