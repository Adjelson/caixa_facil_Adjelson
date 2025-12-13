import { PartialType } from "@nestjs/mapped-types";
import { CreateCashSessionDto } from "./create-cash-session.dto";
import { IsNumber, IsOptional } from "class-validator";

export class UpdateCashSessionDto extends PartialType(CreateCashSessionDto) {
  @IsOptional()
  @IsNumber()
  closingBalance?: number;
}
