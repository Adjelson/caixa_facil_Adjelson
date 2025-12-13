import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RequirePermission } from "../auth/permissions.decorator";
import { PermissionsGuard } from "../auth/permissions.guard";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Controller("products")
@UseGuards(AuthGuard("jwt"), PermissionsGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @RequirePermission("product.create")
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @RequirePermission("product.view")
  findAll() {
    return this.productsService.findAll();
  }

  @Get("barcode/:barcode")
  @RequirePermission("product.view")
  async findByBarcode(@Param("barcode") barcode: string) {
    const product = await this.productsService.findByBarcode(barcode);
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    return product;
  }

  @Get(":id")
  @RequirePermission("product.view")
  findOne(@Param("id") id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(":id")
  @RequirePermission("product.update")
  update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(":id")
  @RequirePermission("product.delete")
  remove(@Param("id") id: string) {
    return this.productsService.remove(+id);
  }
}
