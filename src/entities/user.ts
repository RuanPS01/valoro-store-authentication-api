import { Types } from 'mongoose';

export interface User {
  id?: Types.ObjectId;

  username: string;

  email: string;

  password: string;

  verified?: boolean;

  createdAt?: Date;

  updatedAt?: Date;

  roles?: string[];

  confirmationCode?: string;

  resetCode?: string;

  refreshToken?: string;

  lastLogin?: Date;
}
