const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");
const { ValidationError, UnauthorizedError } = require("../utils/errors");
const { BCRYPT_ROUNDS } = require("../utils/constants");

class AuthService {
  async register(userData) {
    const { phone, email, password, role, full_name } = userData;

    const [existingByPhone, existingByEmail] = await Promise.all([
      userRepository.findByPhone(phone),
      userRepository.findByEmail(email),
    ]);

    if (existingByPhone) {
      throw new ValidationError("Пользователь с таким номером уже существует");
    }
    if (existingByEmail) {
      throw new ValidationError("Пользователь с таким email уже существует");
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await userRepository.create({
      phone,
      email,
      password: hashedPassword,
      role: role || "player",
      full_name,
    });

    return {
      token: this.generateToken(user.id),
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        created_at: user.created_at,
      },
    };
  }

  async login(identifier, password) {
    const user = await userRepository.findByIdentifier(identifier);
    if (!user) {
      throw new UnauthorizedError("Неверный номер телефона / email или пароль");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError("Неверный номер телефона / email или пароль");
    }

    return {
      token: this.generateToken(user.id),
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        created_at: user.created_at,
      },
    };
  }

  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    });
  }

  async verifyToken(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepository.findById(decoded.id);
    if (!user) throw new UnauthorizedError("Token is not valid");
    return user;
  }
}

module.exports = new AuthService();
