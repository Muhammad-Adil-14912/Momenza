import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../../data/db.json');

let isConnectedToMongo = false;

// Fallback in-memory & file-backed store for when MongoDB Atlas URI is not configured
class LocalStore {
  constructor() {
    this.data = {
      users: [],
      events: [],
      expenses: [],
      tasks: [],
      guests: [],
      vendors: [],
      moodboards: []
    };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.save();
      }
    } catch (err) {
      console.warn('⚠️ Could not load local db.json, initializing fresh store:', err.message);
    }
  }

  save() {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('❌ Error saving local store:', err.message);
    }
  }

  getCollection(name) {
    if (!this.data[name]) {
      this.data[name] = [];
    }
    return {
      find: (filter = {}) => {
        return this.data[name].filter(item => {
          return Object.keys(filter).every(key => item[key] === filter[key]);
        });
      },
      findOne: (filter = {}) => {
        return this.data[name].find(item => {
          return Object.keys(filter).every(key => item[key] === filter[key]);
        });
      },
      findById: (id) => {
        return this.data[name].find(item => item._id === id || item.id === id);
      },
      create: (doc) => {
        const item = {
          _id: doc._id || 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 7),
          ...doc,
          createdAt: doc.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.data[name].push(item);
        this.save();
        return item;
      },
      findByIdAndUpdate: (id, update, options = {}) => {
        const idx = this.data[name].findIndex(item => item._id === id || item.id === id);
        if (idx === -1) return null;
        this.data[name][idx] = {
          ...this.data[name][idx],
          ...update,
          updatedAt: new Date().toISOString()
        };
        this.save();
        return this.data[name][idx];
      },
      findByIdAndDelete: (id) => {
        const idx = this.data[name].findIndex(item => item._id === id || item.id === id);
        if (idx === -1) return null;
        const removed = this.data[name].splice(idx, 1)[0];
        this.save();
        return removed;
      },
      deleteMany: (filter = {}) => {
        const before = this.data[name].length;
        this.data[name] = this.data[name].filter(item => {
          return !Object.keys(filter).every(key => item[key] === filter[key]);
        });
        this.save();
        return { deletedCount: before - this.data[name].length };
      }
    };
  }
}

export const localStore = new LocalStore();

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.trim() === '') {
    console.log('ℹ️  No MONGODB_URI detected in .env. Running in Resilient Local Persistence Mode.');
    console.log(`📁 Local database path: ${DATA_FILE}`);
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    isConnectedToMongo = true;
    return true;
  } catch (err) {
    console.warn(`⚠️ MongoDB Connection Failed: ${err.message}`);
    console.log('🔄 Falling back seamlessly to Resilient Local Persistence Mode.');
    isConnectedToMongo = false;
    return false;
  }
};

export const getDBStatus = () => {
  return {
    isMongo: isConnectedToMongo,
    type: isConnectedToMongo ? 'MongoDB Atlas' : 'Local Persistent Storage',
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5)
  };
};
