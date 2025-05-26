import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { UpdateStockDto } from './dto/update-stock.dto';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly svc: InventoryService) {}

  @Get()
  list() {
    return this.svc.getStock();
  }

  @Patch()
  update(
    @Body() dto: UpdateStockDto,
    @Query('mode') mode: 'purchase' | 'sell' = 'purchase',
  ) {
    return this.svc.update(dto, mode);
  }
}
