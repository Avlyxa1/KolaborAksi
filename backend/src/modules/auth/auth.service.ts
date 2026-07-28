import bcrypt from 'bcryptjs';
import { firebaseAuth } from '../../config/firebaseAdmin.js';
import prisma from '../../config/prisma.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../utils/jwt.js';
import type {
  GoogleAuthInput,
  RegisterInput,
  LoginInput,
  RefreshTokenInput,
} from './auth.schema.js';

const SALT_ROUNDS = 12;

/**
 * Sanitize user object — strip sensitive fields before sending to client.
 */
function sanitizeUser(user: {
  id: string;
  nama: string;
  email: string;
  photoUrl: string | null;
  authProvider: string;
  role: string;
  createdAt: Date;
}) {
  return {
    id: user.id,
    nama: user.nama,
    email: user.email,
    photoUrl: user.photoUrl,
    authProvider: user.authProvider,
    role: user.role,
    createdAt: user.createdAt,
  };
}

/**
 * Issue JWT tokens (access + refresh) and persist refresh token in DB.
 */
async function issueTokens(user: { id: string; email: string; role: string }) {
  const payload = { userId: user.id, email: user.email, role: user.role };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Persist refresh token in DB for validation on refresh
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { accessToken, refreshToken };
}

// ============================================
// Google Sign-In
// ============================================

export async function googleAuth(input: GoogleAuthInput) {
  // 1. Verify Firebase ID token
  const decodedToken = await firebaseAuth.verifyIdToken(input.idToken);
  const { uid, email, name, picture } = decodedToken;

  if (!email) {
    throw new Error('Akun Google tidak memiliki email');
  }

  // 2. Find or create user
  let user = await prisma.user.findUnique({
    where: { firebaseUid: uid },
  });

  if (!user) {
    // Check if email already exists (registered via email/password)
    const existingByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingByEmail) {
      // Link Google account to existing email-registered user
      user = await prisma.user.update({
        where: { id: existingByEmail.id },
        data: {
          firebaseUid: uid,
          photoUrl: picture || existingByEmail.photoUrl,
          authProvider: 'google',
        },
      });
    } else {
      // Create new user with default role 'relawan'
      user = await prisma.user.create({
        data: {
          nama: name || email.split('@')[0]!,
          email,
          firebaseUid: uid,
          photoUrl: picture || null,
          authProvider: 'google',
          role: 'relawan',
        },
      });
    }
  }

  // 3. Issue JWT tokens
  const tokens = await issueTokens(user);

  return {
    user: sanitizeUser(user),
    ...tokens,
  };
}

// ============================================
// Email/Password Register
// ============================================

export async function register(input: RegisterInput) {
  // Check if email already exists
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    throw new Error('Email sudah terdaftar');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  // Create user
  const user = await prisma.user.create({
    data: {
      nama: input.nama,
      email: input.email,
      password: hashedPassword,
      authProvider: 'email',
      role: 'relawan',
    },
  });

  // Issue JWT tokens
  const tokens = await issueTokens(user);

  return {
    user: sanitizeUser(user),
    ...tokens,
  };
}

// ============================================
// Email/Password Login
// ============================================

export async function login(input: LoginInput) {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user || !user.password) {
    throw new Error('Email atau password salah');
  }

  // Verify password
  const isValid = await bcrypt.compare(input.password, user.password);
  if (!isValid) {
    throw new Error('Email atau password salah');
  }

  // Issue JWT tokens
  const tokens = await issueTokens(user);

  return {
    user: sanitizeUser(user),
    ...tokens,
  };
}

// ============================================
// Refresh Token
// ============================================

export async function refreshToken(input: RefreshTokenInput) {
  // Verify refresh token
  const decoded = verifyRefreshToken(input.refreshToken);

  // Check if the refresh token matches what's stored in DB
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user || user.refreshToken !== input.refreshToken) {
    throw new Error('Refresh token tidak valid');
  }

  // Issue new tokens
  const tokens = await issueTokens(user);

  return {
    user: sanitizeUser(user),
    ...tokens,
  };
}

// ============================================
// Get Current User (from JWT payload)
// ============================================

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User tidak ditemukan');
  }

  return sanitizeUser(user);
}

// ============================================
// Logout (clear refresh token)
// ============================================

export async function logout(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
}
