const { Pool } = require("pg");

let pool = null;
let useMemoryStorage = false;

const initDatabase = async () => {
  try {
    // Пробуем подключиться к PostgreSQL
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/Scout_kz',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    // Проверяем соединение
    await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL connected successfully');
    return true;
  } catch (error) {
    console.log('⚠️ PostgreSQL not available, using memory storage');
    console.log('Error:', error.message);
    useMemoryStorage = true;
    return false;
  }
};

// In-memory storage для разработки
const memoryStorage = {
  users: [],
  players: [],
  videos: [],
  ratings: [],
  nextId: 1
};

const getNextId = () => memoryStorage.nextId++;

const mockQuery = async (text, params) => {
  console.log('Mock query:', text, params);
  
  if (text.includes('INSERT INTO users')) {
    const user = {
      id: getNextId(),
      phone: params[0],
      email: params[1],
      password_hash: params[2],
      full_name: params[3],
      role: params[4] || 'player',
      created_at: new Date()
    };
    memoryStorage.users.push(user);
    return { rows: [user] };
  }
  
  if (text.includes('SELECT') && text.includes('users')) {
    if (text.includes('email = $1')) {
      const user = memoryStorage.users.find(u => u.email === params[0]);
      return { rows: user ? [user] : [] };
    }
    if (text.includes('phone = $1')) {
      const user = memoryStorage.users.find(u => u.phone === params[0]);
      return { rows: user ? [user] : [] };
    }
    if (text.includes('id = $1')) {
      const user = memoryStorage.users.find(u => u.id == params[0]);
      return { rows: user ? [user] : [] };
    }
  }
  
  return { rows: [] };
};

const query = async (text, params = []) => {
  if (useMemoryStorage) {
    return mockQuery(text, params);
  }
  
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

module.exports = {
  initDatabase,
  query,
  pool,
  useMemoryStorage: () => useMemoryStorage
};
