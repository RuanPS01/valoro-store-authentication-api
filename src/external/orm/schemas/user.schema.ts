import { User } from '@entities/user';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<UserEntity>;

@Schema()
export class UserEntity implements User {
  @Prop()
  id: Types.ObjectId;

  @Prop({ required: true, type: String })
  username: string;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: true, default: false })
  verified: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({
    enum: ['user', 'admin'],
    default: ['user'],
    type: [String],
  })
  roles: string[];

  @Prop({ required: false, type: String, default: null })
  confirmationCode: string;

  @Prop({ required: false, type: String, default: null })
  resetCode: string;

  @Prop({ required: false, type: String })
  refreshToken: string;

  @Prop({ required: false })
  lastLogin: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
