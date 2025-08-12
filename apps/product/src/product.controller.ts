import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

    // create new product
    @Post('create')
    async addProduct(@Body() createProductDto:CreateProductDto): Promise<CreateProductDto>{
        return this.productService.addProduct(createProductDto);
    }

    // find all products
    @Get('all')
    async findProducts(): Promise<CreateProductDto[]>{
        console.log('here');
        return this.productService.findProducts();
    }

    // find product by ID
    @Get(':id')
    async findProductById(@Param('id', new ParseUUIDPipe()) id: string): Promise<CreateProductDto>{
        return this.productService.findProductById(id);
    }

    // delete product by ID
    @Delete(':id/remove')
    async deleteProduct(@Param('id', new ParseUUIDPipe()) id: string): Promise<string>{
        return this.productService.deleteProduct(id);
    }

    
}
