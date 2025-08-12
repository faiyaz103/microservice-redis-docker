import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/product.dto';

@Controller()
export class ProductEventController {
    constructor(private readonly productService: ProductService) {}

    
}
