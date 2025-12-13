import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { PaymentMethod } from "../entities/payment.entity";

class SaleItemDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  @IsOptional()
  discount?: number;
}

class PaymentDto {
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsNumber()
  amount: number;
}

export class CreateSaleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentDto)
  payments: PaymentDto[];

  @IsNumber()
  @IsOptional()
  discountAmount?: number;

  @IsString()
  @IsOptional()
  discountReason?: string;
}
