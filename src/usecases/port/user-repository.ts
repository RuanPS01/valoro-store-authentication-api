import { User } from '@entities/user';
import { FindUserOptions } from '../v1/auth/interfaces/find-user-options';
import { ListUserOptions } from '../v1/auth/interfaces/list-user-options';
import { ListUserResponse } from '../v1/auth/interfaces/list-user-response';

export interface UserRepositoryPort {
  findOne(findUserOptions: FindUserOptions): Promise<User>;
  save(entity: User): Promise<User>;
  find(listUserOptions: ListUserOptions): Promise<ListUserResponse>;
  updateRefreshToken(email: string, refreshToken: string): Promise<void>;
  updateLastLogin(email: string): Promise<void>;
}
