import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' }
})

export class User extends Document {
  @Prop()
  name: string;

  @Prop()
  phone: number;

  @Prop()
  email: string;

  @Prop()
  address: string;

  @Prop()
  createDate: Date;

  @Prop()
  updateDate: Date;

  @Prop()
  status: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
