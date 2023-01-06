import { User } from '@entities/user';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserRepositoryPort } from '@usecases/port/user-repository';
import { FindUserOptions } from '@usecases/v1/auth/interfaces/find-user-options';
import { ListUserOptions } from '@usecases/v1/auth/interfaces/list-user-options';
import { ListUserResponse } from '@usecases/v1/auth/interfaces/list-user-response';
import { Model } from 'mongoose';
import { UserEntity } from '../schemas/user.schema';

@Injectable()
export class UserRepositoryImpl implements UserRepositoryPort {
  constructor(
    @InjectModel('User')
    private userModel: Model<UserEntity>,
  ) {}

  async findOne(findUserOptions: FindUserOptions): Promise<User> {
    const { email, id } = findUserOptions;
    let user: User;
    if (email) {
      user = await this.userModel.findOne({ email });
    }
    if (id) {
      user = await this.userModel.findById(id);
    }
    return user;
  }

  async save(entity: User): Promise<User> {
    console.log('user-repository', entity);
    const user: User = await this.userModel.create(entity);
    return user;
  }

  async find(findListUserOptions: ListUserOptions): Promise<ListUserResponse> {
    const { emailContains, verified, totalItemsPerPage, page } =
      findListUserOptions;

    let users: User[];

    if (emailContains || verified) {
      users = await this.userModel.find({
        email: { $regex: `/${emailContains}/i` },
        verified: verified ?? undefined,
      });
    }

    if (totalItemsPerPage) {
      users = await this.userModel
        .find({ email: { $regex: `/${emailContains}/i` } })
        .skip(page && page > 0 ? (page - 1) * totalItemsPerPage : 0)
        .limit(totalItemsPerPage);
    }

    const totalPages = Math.ceil(users.length / totalItemsPerPage);

    return {
      data: users,
      page,
      totalItems: users.length,
      totalItemsPerPage,
      totalPages,
    };
  }

  async updateRefreshToken(email: string, refreshToken: string): Promise<void> {
    await this.userModel.updateOne(
      {
        email,
      },
      { refreshToken },
    );
  }

  async updateLastLogin(email: string): Promise<void> {
    await this.userModel.updateOne(
      {
        email,
      },
      { lastLogin: new Date() },
    );
  }
}
