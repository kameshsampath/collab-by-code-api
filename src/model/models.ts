import mongoose from 'mongoose';

const Option = new mongoose.Schema({
   index: {
     type: String,
     required: true,
     minlength: 1,
     maxlength: 1,
     trim: true
   },
   text: {
    type: String,
    required: true,
    trim: true
   },
   imageFrame: {
    type: String,
    minlength: 5,
    trim: true
   },
});

const questionsSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    minlength: 10,
    trim: true
  },
  options: {
    type: [Option],
    required: true
  }
});

const userQansSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    minlength: 10,
    trim: true
  },
  email: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 75,
    trim: true
  }
});

export const Questions = mongoose.model('questions', questionsSchema);
export const UserQAns = mongoose.model('user_qans', userQansSchema);