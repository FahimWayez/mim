import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

export enum MessageStatus {
  PENDING = 'pending',
  REJECTED = 'rejected',
  SUCCESS = 'success',
}

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  trxId: number;

  @Prop({ default: MessageStatus.PENDING, enum: MessageStatus })
  status: MessageStatus;

  @Prop({ default: 0 })
  attemptCount: number;

  @Prop({ type: Date, default: null })
  nextAttemptAt: Date | null;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
