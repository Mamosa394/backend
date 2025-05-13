import express from 'express';
import Query from "../models/query.js"; 
import FAQ from '../models/faq.js'; 
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Define __dirname for ES Modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const router = express.Router();

// 🔍 Function: Compare message similarity
function findSimilarQuery(newMessage, entries) {
  let bestMatch = null;
  let highestScore = 0;

  entries.forEach((entry) => {
    const similarity = simpleSimilarity(newMessage, entry.question || entry.message);
    if (similarity > highestScore && similarity > 0.6) {
      highestScore = similarity;
      bestMatch = entry;
    }
  });

  return bestMatch;
}

// 🔣 Simple similarity scoring (word-based)
function simpleSimilarity(str1, str2) {
  const words1 = new Set(str1.toLowerCase().split(/\s+/));
  const words2 = new Set(str2.toLowerCase().split(/\s+/));
  const intersection = new Set([...words1].filter(word => words2.has(word)));
  return intersection.size / Math.max(words1.size, words2.size);
}

// 📧 Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});

// ✅ POST: Log a new query
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Search FAQs for similar question first
    const faqs = await FAQ.find();
    const similarFAQ = findSimilarQuery(message, faqs);

    let status = 'pending';
    let autoReplyMessage = '';

    if (similarFAQ) {
  autoReplyMessage = `Auto-Reply: Based on your query, here's an answer:\n\n"${similarFAQ.answer}"`;
  status = 'complete';
}

if (similarFAQ) {
  autoReplyMessage = `Auto-Reply: Based on your query, here's an answer:\n\n"${similarFAQ.answer}"`;
  status = 'complete';
}


    const newQuery = new Query({
      name,
      email,
      message,
      status,
      autoReply: autoReplyMessage
    });

    await newQuery.save();

    const backupPath = path.join(__dirname, 'backup/queries.json');
    const queries = await Query.find();
    fs.writeFileSync(backupPath, JSON.stringify(queries, null, 2));

    res.status(200).json({ message: 'Query submitted', status, autoReply: autoReplyMessage });
  } catch (error) {
    console.error('Error submitting query:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET: All queries
router.get('/', async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch queries' });
  }
});

// ✅ PUT: Update query status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Query.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Query not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating query' });
  }
});

// ✅ DELETE: Remove query by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Query.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Query not found' });
    }
    res.status(200).json({ message: 'Query deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting query' });
  }
});

// ✅ GET: Fetch all FAQs
router.get('/faqs', async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.status(200).json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ message: 'Failed to fetch FAQs' });
  }
});


export default router;
