import { Body, Controller, Get, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly svc: MessagesService) {}

  @Post()
  async create(@Body('trxId') trxId: number) {
    return this.svc.create(trxId);
  }

  @Get()
  async list() {
    return this.svc['model'].find().sort({ createdAt: 1 }).exec();
  }
}
