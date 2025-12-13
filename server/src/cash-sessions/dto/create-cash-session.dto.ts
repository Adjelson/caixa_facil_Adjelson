import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCashSessionDto {
  @IsNumber()
  openingBalance: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
