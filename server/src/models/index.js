import mongoose from 'mongoose';
import { localStore } from '../config/db.js';

// --- Mongoose Schemas ---
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  firebaseUid: { type: String },
  avatar: { type: String }
}, { timestamps: true });

const EventSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  eventName: { type: String, required: true },
  eventType: { type: String, required: true },
  eventDate: { type: String, required: true },
  location: { type: String, required: true },
  guestCount: { type: Number, required: true },
  totalBudget: { type: Number, required: true },
  theme: { type: String, default: 'Editorial Elegance' },
  preferences: {
    foodPreferences: { type: String, default: 'Mixed' },
    specialRequirements: { type: String, default: '' },
    colorScheme: { type: [String], default: ['#C47B62', '#A7B29A', '#FAF9F6'] }
  },
  generatedPlan: { type: Object, default: {} },
  planVersions: [{
    version: Number,
    timestamp: String,
    summary: String,
    plan: Object
  }]
}, { timestamps: true });

const ExpenseSchema = new mongoose.Schema({
  eventId: { type: String, required: true, index: true },
  userId: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  estimatedAmount: { type: Number, default: 0 },
  actualAmount: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['pending', 'deposit_paid', 'paid'], default: 'pending' },
  notes: { type: String }
}, { timestamps: true });

const TaskSchema = new mongoose.Schema({
  eventId: { type: String, required: true, index: true },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  deadline: { type: String },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  phase: { type: String, default: 'One month before' },
  assignedTo: { type: String, default: 'You' }
}, { timestamps: true });

const GuestSchema = new mongoose.Schema({
  eventId: { type: String, required: true, index: true },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  category: { type: String, enum: ['family', 'friends', 'vip', 'colleagues', 'other'], default: 'friends' },
  rsvpStatus: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  additionalGuests: { type: Number, default: 0 },
  dietaryRequirements: { type: String, default: 'None' },
  tableNumber: { type: String, default: 'Unassigned' }
}, { timestamps: true });

const VendorSchema = new mongoose.Schema({
  eventId: { type: String, index: true },
  userId: { type: String },
  vendorId: { type: String },
  businessName: { type: String, required: true },
  category: { type: String, required: true },
  bookingStatus: { type: String, enum: ['inquired', 'quoted', 'booked', 'available'], default: 'available' },
  agreedPrice: { type: Number, default: 0 },
  pricingRange: { type: String },
  rating: { type: Number, default: 4.8 },
  reviewsCount: { type: Number, default: 24 },
  location: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  image: { type: String, default: '' },
  services: { type: [String], default: [] },
  isDemo: { type: Boolean, default: false }
}, { timestamps: true });

const MoodboardSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  eventId: { type: String },
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, default: '' },
  images: { type: [String], default: [] },
  colorPalette: { type: [String], default: [] },
  floralIdeas: { type: [String], default: [] },
  decorConcepts: { type: [String], default: [] },
  tableSetting: { type: String, default: '' }
}, { timestamps: true });

// Models
const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
const EventModel = mongoose.models.Event || mongoose.model('Event', EventSchema);
const ExpenseModel = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
const TaskModel = mongoose.models.Task || mongoose.model('Task', TaskSchema);
const GuestModel = mongoose.models.Guest || mongoose.model('Guest', GuestSchema);
const VendorModel = mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);
const MoodboardModel = mongoose.models.Moodboard || mongoose.model('Moodboard', MoodboardSchema);

// Resilient Unified Repository Factory
function createRepo(name, MongooseModel) {
  return {
    async find(filter = {}) {
      if (mongoose.connection.readyState === 1) {
        return await MongooseModel.find(filter).lean();
      }
      return localStore.getCollection(name).find(filter);
    },
    async findOne(filter = {}) {
      if (mongoose.connection.readyState === 1) {
        return await MongooseModel.findOne(filter).lean();
      }
      return localStore.getCollection(name).findOne(filter);
    },
    async findById(id) {
      if (mongoose.connection.readyState === 1) {
        return await MongooseModel.findById(id).lean();
      }
      return localStore.getCollection(name).findById(id);
    },
    async create(doc) {
      if (mongoose.connection.readyState === 1) {
        const item = await MongooseModel.create(doc);
        return item.toObject();
      }
      return localStore.getCollection(name).create(doc);
    },
    async findByIdAndUpdate(id, update, options = { new: true }) {
      if (mongoose.connection.readyState === 1) {
        return await MongooseModel.findByIdAndUpdate(id, update, options).lean();
      }
      return localStore.getCollection(name).findByIdAndUpdate(id, update, options);
    },
    async findByIdAndDelete(id) {
      if (mongoose.connection.readyState === 1) {
        return await MongooseModel.findByIdAndDelete(id).lean();
      }
      return localStore.getCollection(name).findByIdAndDelete(id);
    },
    async deleteMany(filter = {}) {
      if (mongoose.connection.readyState === 1) {
        return await MongooseModel.deleteMany(filter);
      }
      return localStore.getCollection(name).deleteMany(filter);
    }
  };
}

export const Users = createRepo('users', UserModel);
export const Events = createRepo('events', EventModel);
export const Expenses = createRepo('expenses', ExpenseModel);
export const Tasks = createRepo('tasks', TaskModel);
export const Guests = createRepo('guests', GuestModel);
export const Vendors = createRepo('vendors', VendorModel);
export const Moodboards = createRepo('moodboards', MoodboardModel);
