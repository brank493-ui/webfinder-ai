/**
 * Auth Utilities - JWT, Password Hashing, Token Management
 * Part of WebFinder AI Backend
 */

import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const JWT_EXPIRES_IN = '15m';
const JWT_REFRESH_EXPIRES_IN = '7d';

export type UserRole = 'owner' | 'admin' | 'developer' | 'sales' | 'client' | 'user';

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  sessionId: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT access token
 */
export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Generate refresh token
 */
export function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId, tokenId: uuidv4() }, JWT_REFRESH_SECRET, { 
    expiresIn: JWT_REFRESH_EXPIRES_IN 
  });
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): { userId: string; tokenId: string } | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string; tokenId: string };
  } catch {
    return null;
  }
}

/**
 * Generate unique credential number (7-8 alphanumeric)
 */
export function generateCredentialNumber(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate unique access code for client onboarding
 */
export async function generateAccessCode(): Promise<string> {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  let isUnique = false;
  
  while (!isUnique) {
    code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const existing = await db.accessCode.findUnique({ where: { code } });
    if (!existing) {
      isUnique = true;
    }
  }
  
  return code;
}

/**
 * Create auth tokens and session
 */
export async function createAuthSession(
  userId: string, 
  deviceInfo?: string, 
  ipAddress?: string
): Promise<AuthTokens> {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const sessionId = uuidv4();
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role as UserRole,
    sessionId,
  });
  
  const refreshToken = generateRefreshToken(userId);
  
  // Calculate expiration (15 minutes)
  const expiresIn = 15 * 60; // seconds

  // Create session in database
  await db.session.create({
    data: {
      id: sessionId,
      userId,
      token: accessToken,
      deviceInfo,
      ipAddress,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  // Store refresh token
  await db.refreshToken.create({
    data: {
      userId,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // Update last login
  await db.user.update({
    where: { id: userId },
    data: { lastLoginAt: new Date() },
  });

  return { accessToken, refreshToken, expiresIn };
}

/**
 * Refresh auth tokens
 */
export async function refreshAuthTokens(refreshToken: string): Promise<AuthTokens | null> {
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) return null;

  // Check if refresh token exists and is not revoked
  const storedToken = await db.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!storedToken || storedToken.revoked) return null;

  // Revoke old refresh token
  await db.refreshToken.update({
    where: { id: storedToken.id },
    data: { revoked: true },
  });

  // Create new session
  return createAuthSession(decoded.userId);
}

/**
 * Logout - revoke session and refresh tokens
 */
export async function logout(userId: string, sessionId?: string): Promise<void> {
  if (sessionId) {
    await db.session.deleteMany({
      where: { userId, id: sessionId },
    });
  } else {
    await db.session.deleteMany({
      where: { userId },
    });
  }

  await db.refreshToken.updateMany({
    where: { userId },
    data: { revoked: true },
  });
}

/**
 * Role-based access control middleware helper
 */
export function hasPermission(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    owner: 100,
    admin: 80,
    developer: 60,
    sales: 40,
    client: 20,
    user: 20,
  };

  const userLevel = roleHierarchy[userRole] || 0;
  return requiredRoles.some(role => userLevel >= (roleHierarchy[role] || 0));
}

/**
 * Check if user can access workspace
 */
export async function canAccessWorkspace(userId: string, workspaceId: string): Promise<boolean> {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return false;

  // Owner and admin can access all workspaces
  if (user.role === 'owner' || user.role === 'admin') return true;

  // Others can only access their own workspaces
  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId },
    select: { clientId: true },
  });

  return workspace?.clientId === userId;
}

export default {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateCredentialNumber,
  generateAccessCode,
  createAuthSession,
  refreshAuthTokens,
  logout,
  hasPermission,
  canAccessWorkspace,
};
