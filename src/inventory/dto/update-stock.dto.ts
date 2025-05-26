import { IsInt, Min } from 'class-validator';

export class UpdateStockDto {
  @IsInt() @Min(0) ton: number;
  @IsInt() @Min(0) kilogram: number;
  @IsInt() @Min(0) gram: number;
  @IsInt() @Min(0) milligram: number;
}
