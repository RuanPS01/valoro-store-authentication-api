export interface LoginResponse {
  user: UserInfo;
  accessToken: string;
  refreshToken: string;
}

interface UserInfo {
  email: string;
  verified?: boolean;
  createdAt?: Date;
}
