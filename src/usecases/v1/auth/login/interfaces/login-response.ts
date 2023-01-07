export interface LoginResponse {
  user: UserInfo;
  accessToken: string;
  refreshToken: string;
}

interface UserInfo {
  id: string;
  email: string;
  verified?: boolean;
  createdAt?: Date;
}
