import { User } from '@entities/user';

export interface ListUserResponse {
  data: User[];
  page: number;
  totalItems: number;
  totalItemsPerPage: number;
  totalPages: number;
}
