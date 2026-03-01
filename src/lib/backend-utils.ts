// ==========================================
// WEBFINDER AI - BACKEND UTILITIES
// ==========================================

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const db = new PrismaClient();

// ==========================================
// JWT & AUTH UTILITIES
// ==========================================

const JWT_SECRET = process.env.JWT_SECRET || 'webfinder-ai-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'webfinder-ai-refresh-secret';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  type: 'access' | 'refresh';
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function generateAccessToken(user: AuthUser): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    type: 'access',
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(user: AuthUser): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    type: 'refresh',
  };
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

// ==========================================
// PASSWORD UTILITIES
// ==========================================

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ==========================================
// ACCESS CODE GENERATOR
// ==========================================

export function generateAccessCode(length: number = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// ==========================================
// SLUG GENERATOR
// ==========================================

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    + '-' + crypto.randomBytes(3).toString('hex');
}

// ==========================================
// AUTH MIDDLEWARE
// ==========================================

export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.substring(7);
  const payload = verifyAccessToken(token);
  if (!payload) return null;

  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true, role: true, isActive: true },
  });

  if (!user || !user.isActive) return null;

  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

export function withAuth(handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return handler(request, user);
  };
}

export function withRole(roles: string[]) {
  return (handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>) => {
    return withAuth(async (request, user) => {
      if (!roles.includes(user.role)) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
      }
      return handler(request, user);
    });
  };
}

// ==========================================
// RESPONSE UTILITIES
// ==========================================

export function successResponse(data: unknown, status: number = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status: number = 400): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function paginatedResponse(
  data: unknown[],
  total: number,
  page: number,
  limit: number
): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  });
}

// ==========================================
// LOGGING UTILITIES
// ==========================================

export async function logActivity(
  action: string,
  options: {
    userId?: string;
    entityType?: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
  } = {}
): Promise<void> {
  try {
    await db.activityLog.create({
      data: {
        userId: options.userId,
        action,
        entityType: options.entityType,
        entityId: options.entityId,
        metadata: options.metadata ? JSON.stringify(options.metadata) : null,
        ipAddress: options.ipAddress,
        userAgent: options.userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

// ==========================================
// NOTIFICATION UTILITIES
// ==========================================

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  description: string,
  options: { actionUrl?: string; actionLabel?: string; metadata?: Record<string, unknown> } = {}
): Promise<void> {
  try {
    await db.notification.create({
      data: {
        userId,
        type,
        title,
        description,
        actionUrl: options.actionUrl,
        actionLabel: options.actionLabel,
        metadata: options.metadata ? JSON.stringify(options.metadata) : null,
      },
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
}

// ==========================================
// PAGINATION UTILITIES
// ==========================================

export function getPaginationParams(request: NextRequest): { page: number; limit: number; skip: number } {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

// ==========================================
// PACKAGE PRICING
// ==========================================

export const PACKAGE_PRICES = {
  standard: { usd: 149, xaf: 91500 },
  pro: { usd: 399, xaf: 245000 },
  premium: { usd: 999, xaf: 612000 },
} as const;

export type PackageType = keyof typeof PACKAGE_PRICES;
