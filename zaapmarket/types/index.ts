// import { User } from '@prisma/client';

export interface SessionUser {
  id: string;
  name?: string | null;
  email: string;
}

export interface Session {
  user: SessionUser;
  expires: string;
}

export interface ItemData {
  id: string;
  name: string;
  purchasePrice: number;
  sellingPrice: number;
  roi: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemFormData {
  name: string;
  purchasePrice: number;
  sellingPrice: number;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Type pour étendre next-auth
declare module "next-auth" {
  interface Session {
    user: SessionUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    email: string;
  }
}