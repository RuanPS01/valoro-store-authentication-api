import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEntity, UserSchema } from '../schemas/user.schema';
import { UserRepositoryImpl } from './user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]),
  ],
  providers: [UserRepositoryImpl],
  exports: [UserRepositoryImpl],
})
export class UserRepositoryModule {}
