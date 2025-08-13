import { Body, Controller, Delete, Get, InternalServerErrorException, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/product.dto';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ProductEventController {
    constructor(private readonly productService: ProductService) {}

    @EventPattern('update-product-quantity')
    async handleProductQuantity(@Payload() data: {productId: string, quantity: number}){

        try {
            await this.productService.updateProductQuantity(data.productId, data.quantity);
        } catch (error) {
            console.error('Error updating product quantity:', error);
            throw new InternalServerErrorException('Error updating product quantity');
        }
    }

    @MessagePattern('get-product-quantity')
    async handlegetProductQuantity(@Payload() data: {productId: string}): Promise<number>{

        try {
            return await this.productService.getProductQuantity(data.productId);
        } catch (error) {
            console.error('Error getting product quantity:', error);
            throw new InternalServerErrorException('Error getting product quantity');
        }
    }
}
