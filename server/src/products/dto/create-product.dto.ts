import { IsString, IsNumber, IsOptional } from "class-validator";

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  barcode: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  costPrice?: number;

  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsNumber()
  @IsOptional()
  minStock?: number;

  @IsNumber()
  @IsOptional()
  categoryId?: number;
}
