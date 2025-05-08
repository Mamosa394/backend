// models/queryModel.js 

import mongoose from 'mongoose';

const querySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'complete'],
    default: 'pending'
  },
  autoReply: {
    type: String,
    default: ''
  },
  isAutoResponded: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Query = mongoose.model('Query', querySchema);

export default Query;
