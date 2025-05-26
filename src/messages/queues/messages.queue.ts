import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class MessagesQueue {
  constructor(@InjectQueue('messages') private readonly queue: Queue) {}

  async enqueue(messageId: string, delayMs = 0) {
    await this.queue.add(
      'process',
      { messageId },
      { delay: delayMs, removeOnComplete: true, removeOnFail: true },
    );
  }
}
