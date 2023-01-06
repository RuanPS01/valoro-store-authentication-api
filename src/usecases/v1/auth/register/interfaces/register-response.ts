import { Types } from 'mongoose';

export interface RegisterResponse {
  id: Types.ObjectId;
  username: string;
  email: string;
  verified: boolean;
}
