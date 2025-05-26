import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Message,
  MessageDocument,
  MessageStatus,
} from './schemas/message.schema';
import { MessagesQueue } from './queues/messages.queue';

export const RETRY_TABLE = [
  0,
  2 * 60_000,
  5 * 60_000,
  10 * 60_000,
  20 * 60_000,
  30 * 60_000,
  60 * 60_000,
];

@Injectable()
export class MessagesService {
  private readonly log = new Logger(MessagesService.name);

  constructor(
    @InjectModel(Message.name) private readonly model: Model<MessageDocument>,
    private readonly queue: MessagesQueue,
  ) {}

  async create(trxId: number): Promise<MessageDocument> {
    const doc = await this.model.create({ trxId });

    const id = (doc._id as Types.ObjectId).toString();
    await this.queue.enqueue(id);

    return doc;
  }

  list() {
    return this.model.find().sort({ createdAt: 1 }).exec();
  }

  getById(id: string) {
    return this.model.findById(id).exec();
  }

  validate(trxId: number): boolean {
    return Math.floor(Math.random() * 1000) === trxId;
  }

  async markSuccess(msg: MessageDocument) {
    msg.status = MessageStatus.SUCCESS;
    await msg.save();
    this.log.log(`trxId ${msg.trxId} succeeded`);
  }

  async markRejected(msg: MessageDocument, delayMs: number) {
    msg.status = MessageStatus.REJECTED;
    msg.attemptCount += 1;
    msg.nextAttemptAt = new Date(Date.now() + delayMs);
    await msg.save();
    this.log.warn(
      `trxId ${msg.trxId} failed (attempt #${msg.attemptCount}); retry in ${
        delayMs / 60000
      }m`,
    );
  }
}
