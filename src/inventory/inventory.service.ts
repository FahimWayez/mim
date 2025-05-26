import { Injectable } from '@nestjs/common';
import { UpdateStockDto } from './dto/update-stock.dto';
import {
  fromMilligrams,
  toMilligrams,
} from '../common/utils/unit-conversion.util';

@Injectable()
export class InventoryService {
  private stock = { ton: 0, kilogram: 0, gram: 0, milligram: 0 };

  getStock() {
    return this.stock;
  }

  update(dto: UpdateStockDto, mode: 'purchase' | 'sell') {
    const deltaMg = toMilligrams(dto);
    let totalMg = toMilligrams(this.stock);

    totalMg = mode === 'purchase' ? totalMg + deltaMg : totalMg - deltaMg;
    if (totalMg < 0) throw new Error('Insufficient stock');

    this.stock = fromMilligrams(totalMg);
    return this.stock;
  }
}
