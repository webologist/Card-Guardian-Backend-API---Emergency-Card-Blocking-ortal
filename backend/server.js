const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/card-guardian';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true, trim: true },
  otpSecret: String,
  otpExpiry: Date,
  isVerified: { type: Boolean, default: false },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  preferences: { notifications: Boolean, defaultBank: String }
});

const bankSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  logo: String,
  debitCardSMS: { number: String, content: String, example: String },
  creditCardSMS: { number: String, content: String, example: String },
  debitCardEmail: { address: String, subject: String, template: String },
  creditCardEmail: { address: String, subject: String, template: String },
  customerCareNumber: String,
  website: String,
  supportedMethods: [String],
  blockingTime: String,
  isActive: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now }
});

const activitySchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  phoneNumber: String,
  action: String,
  bankName: String,
  cardType: String,
  timestamp: { type: Date, default: Date.now }
});

const otpSessionSchema = new mongoose.Schema({
  phoneNumber: String,
  otp: String,
  attempts: { type: Number, default: 0 },
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now, expires: 300 }
});

const User = mongoose.model('User', userSchema);
const Bank = mongoose.model('Bank', bankSchema);
const Activity = mongoose.model('Activity', activitySchema);
const OTPSession = mongoose.model('OTPSession', otpSessionSchema);

const generateOTP = () => '123456'; // TEMP: fixed OTP for all numbers (Twilio not yet wired up)

const sendOTP = async (phoneNumber, otp) => {
  console.log(`[OTP] ${phoneNumber}: ${otp}`);
};

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.post('/api/auth/request-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const formattedPhone = phoneNumber.replace(/\D/g, '');
    
    if (formattedPhone.length !== 10 && formattedPhone.length !== 12) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTPSession.deleteMany({ phoneNumber: formattedPhone });
    await OTPSession.create({ phoneNumber: formattedPhone, otp, expiresAt });

    await sendOTP(formattedPhone, otp);

    res.json({
      success: true,
      message: 'OTP sent',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    const formattedPhone = phoneNumber.replace(/\D/g, '');

    const otpSession = await OTPSession.findOne({ phoneNumber: formattedPhone });

    if (!otpSession) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    if (otpSession.otp !== otp) {
      otpSession.attempts += 1;
      if (otpSession.attempts >= 3) {
        await OTPSession.deleteOne({ _id: otpSession._id });
        return res.status(400).json({ error: 'Too many attempts' });
      }
      await otpSession.save();
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    let user = await User.findOne({ phoneNumber: formattedPhone });
    
    if (!user) {
      user = await User.create({
        phoneNumber: formattedPhone,
        isVerified: true,
        lastLogin: new Date()
      });
    } else {
      user.lastLogin = new Date();
      user.isVerified = true;
      await user.save();
    }

    await OTPSession.deleteOne({ _id: otpSession._id });

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: { id: user._id, phoneNumber: user.phoneNumber }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/banks', async (req, res) => {
  try {
    const banks = await Bank.find({ isActive: true });
    res.json(banks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/banks/:bankId', async (req, res) => {
  try {
    const bank = await Bank.findById(req.params.bankId);
    if (!bank) return res.status(404).json({ error: 'Bank not found' });
    res.json(bank);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/activity/log', verifyToken, async (req, res) => {
  try {
    const { action, bankName, cardType } = req.body;
    const user = await User.findById(req.userId);

    await Activity.create({
      userId: req.userId,
      phoneNumber: user.phoneNumber,
      action,
      bankName,
      cardType
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/banks', async (req, res) => {
  try {
    const { bankId, ...bankData } = req.body;

    if (bankId) {
      const bank = await Bank.findByIdAndUpdate(bankId, bankData, { new: true });
      res.json({ success: true, bank });
    } else {
      const bank = await Bank.create(bankData);
      res.json({ success: true, bank });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/banks/:bankId', async (req, res) => {
  try {
    await Bank.findByIdAndDelete(req.params.bankId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/analytics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalActivities = await Activity.countDocuments();
    const totalBanks = await Bank.countDocuments();

    res.json({ totalUsers, totalActivities, totalBanks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const seedBanks = async () => {
  const count = await Bank.countDocuments();
  if (count === 0) {
    const banks = [
      {
        name: 'HDFC Bank',
        debitCardSMS: { number: '72205 00005', content: 'BLOCK DEBIT ****{last4}' },
        creditCardSMS: { number: '72205 00006', content: 'BLOCK CREDIT ****{last4}' },
        debitCardEmail: { address: 'debitblock@hdfcbank.com', subject: 'Block Debit Card' },
        creditCardEmail: { address: 'creditblock@hdfcbank.com', subject: 'Block Credit Card' },
        customerCareNumber: '1860-267-0700',
        website: 'https://www.hdfcbank.com',
        supportedMethods: ['SMS', 'EMAIL', 'PHONE'],
        blockingTime: '2-5 minutes',
        isActive: true
      },
      {
        name: 'ICICI Bank',
        debitCardSMS: { number: '9215676789', content: 'BLOCK DEBIT {last4}' },
        creditCardSMS: { number: '9215676789', content: 'BLOCK CREDIT {last4}' },
        debitCardEmail: { address: 'cards@icicibank.com', subject: 'Block Debit Card' },
        creditCardEmail: { address: 'cards@icicibank.com', subject: 'Block Credit Card' },
        customerCareNumber: '1860-889-0666',
        website: 'https://www.icicibank.com',
        supportedMethods: ['SMS', 'EMAIL', 'PHONE'],
        blockingTime: '1-3 minutes',
        isActive: true
      },
      {
        name: 'Axis Bank',
        debitCardSMS: { number: '9876543210', content: 'BLOCK {last4}' },
        creditCardSMS: { number: '9876543210', content: 'BLOCK {last4}' },
        debitCardEmail: { address: 'cardblock@axisbank.com', subject: 'Block Card' },
        creditCardEmail: { address: 'cardblock@axisbank.com', subject: 'Block Card' },
        customerCareNumber: '1860-500-5555',
        website: 'https://www.axisbank.com',
        supportedMethods: ['SMS', 'EMAIL', 'PHONE'],
        blockingTime: '2-4 minutes',
        isActive: true
      },
      {
        name: 'State Bank of India',
        debitCardSMS: { number: '92888 12345', content: 'BLOCK {last4}' },
        creditCardSMS: { number: '92888 12345', content: 'BLOCK {last4}' },
        debitCardEmail: { address: 'debitcard.block@sbi.co.in', subject: 'Block Card' },
        creditCardEmail: { address: 'creditcard.block@sbi.co.in', subject: 'Block Card' },
        customerCareNumber: '1800-425-3800',
        website: 'https://www.sbi.co.in',
        supportedMethods: ['SMS', 'EMAIL', 'PHONE'],
        blockingTime: '3-5 minutes',
        isActive: true
      },
      {
        name: 'Kotak Bank',
        debitCardSMS: { number: '9876543211', content: 'BLOCK {last4}' },
        creditCardSMS: { number: '9876543211', content: 'BLOCK {last4}' },
        debitCardEmail: { address: 'support@kotak.com', subject: 'Block Card' },
        creditCardEmail: { address: 'support@kotak.com', subject: 'Block Card' },
        customerCareNumber: '1860-266-2666',
        website: 'https://www.kotak.com',
        supportedMethods: ['SMS', 'EMAIL', 'PHONE'],
        blockingTime: '2-3 minutes',
        isActive: true
      }
    ];
    await Bank.insertMany(banks);
    console.log('Seeded 5 banks');
  }
};

seedBanks();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Card Guardian API listening on port ${PORT}`);
});

module.exports = app;
