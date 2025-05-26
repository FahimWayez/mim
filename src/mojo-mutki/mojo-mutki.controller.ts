import { Controller, Get, Query } from '@nestjs/common';
import { MojoMutkiService } from './mojo-mutki.service';

@Controller('mojo-mutki')
export class MojoMutkiController {
  constructor(private readonly svc: MojoMutkiService) {}

  @Get('calculate')
  calculate(@Query('start') start = '10') {
    const totalEaten = this.svc.simulate(+start);
    return { totalEaten };
  }
}
