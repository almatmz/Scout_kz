class UserRepository {
  constructor() {
    this.users = [];
    this.nextId = 1;
  }

  async create(userData) {
    const { phone, email, password_hash, role, full_name } = userData;
    
    const user = {
      id: this.nextId++,
      phone,
      email,
      password_hash,
      role: role || 'player',
      full_name,
      created_at: new Date()
    };
    
    this.users.push(user);
    return user;
  }

  async findById(id) {
    return this.users.find(u => u.id == id) || null;
  }

  async findByPhone(phone) {
    return this.users.find(u => u.phone === phone) || null;
  }

  async findByEmail(email) {
    console.log('Looking for email:', email.toLowerCase());
    console.log('Available users:', this.users.map(u => ({ email: u.email, phone: u.phone })));
    const found = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    console.log('Found user:', found);
    return found || null;
  }

  async findByIdentifier(identifier) {
    return identifier.includes("@")
      ? this.findByEmail(identifier)
      : this.findByPhone(identifier);
  }

  async update(id, updates) {
    const userIndex = this.users.findIndex(u => u.id == id);
    if (userIndex === -1) return null;
    
    this.users[userIndex] = { ...this.users[userIndex], ...updates, updated_at: new Date() };
    return this.users[userIndex];
  }
}

module.exports = new UserRepository();
