import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({  
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,  
    required: true,
    unique: true,  
  },
  role: {
    type: String,
    required: true,
  },
  nots: {
    type: String,  
    required: false,  
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
}, {
  timestamps: true
});
const User = mongoose.model('User', userSchema);

export default User;
