import { Process, Processor, InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { Logger } from '@nestjs/common';
import { MessagesService, RETRY_TABLE } from '../messages.service';

@Processor('messages')
export class MessagesProcessor {
  private readonly log = new Logger(MessagesProcessor.name);

  constructor(
    private readonly svc: MessagesService,
    @InjectQueue('messages') private readonly queue: Queue,
  ) {}

  @Process('process')
  async handle(job: Job<{ messageId: string }>): Promise<void> {
    const { messageId } = job.data;
    const message = await this.svc.getById(messageId);

    if (!message || message.status === 'success') return;

    const success = this.svc.validate(message.trxId);

    if (success) {
      await this.svc.markSuccess(message);
      return;
    }

    const delayMs =
      RETRY_TABLE[Math.min(message.attemptCount + 1, RETRY_TABLE.length - 1)];

    await this.svc.markRejected(message, delayMs);
    await this.queue.add(
      'process',
      { messageId },
      { delay: delayMs, removeOnComplete: true, removeOnFail: true },
    );

    this.log.warn(
      `trxId ${message.trxId} failed attempt #${message.attemptCount}; retry in ${
        delayMs / 60000
      }m`,
    );
  }
}
