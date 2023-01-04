import { User } from '@entities/user';

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
