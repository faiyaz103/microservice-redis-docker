import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/product.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity) private productRepo: Repository<ProductEntity>,
        @Inject(CACHE_MANAGER) private cacheManager:Cache
    ){}
    
    // create new product
    async addProduct(createProductDto: CreateProductDto): Promise<CreateProductDto>{

        try {
            const product=this.productRepo.create(createProductDto);
            const savedProduct=await this.productRepo.save(product);

            const cacheKey=`product_qty_${savedProduct.id}`;
            await this.cacheManager.set(cacheKey,savedProduct.quantity);

            return product;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Error creating product ', error);
        }
    }

    // get product by ID
    async findProductById(id: string): Promise<CreateProductDto>{

        try {
            const product=await this.productRepo.findOne({
                where:{id}
            });

            return product as CreateProductDto;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Error fetching product ', error);
        }
    }

    // get product by ID
    async findProducts(): Promise<CreateProductDto[]>{

        try {
            const products=await this.productRepo.find();

            return products;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Error fetching products ', error);
        }
    }

    // delete product by ID
    async deleteProduct(id: string): Promise<string>{

        try {

            const cacheKey=`product_qty_${id}`;
            await this.cacheManager.del(cacheKey);
            
            await this.productRepo.delete(id);

            return 'Deleted successfully';
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Error deleting product ', error);
        }
    }

    // update product quantity
    async updateProductQuantity(productId: string, orderQuantity: number): Promise<void>{

        const product=await this.productRepo.findOne({
            where:{id:productId}
        });

        if(!product) throw new NotFoundException('Product not found');

        try {

            const cacheKey=`product_qty_${product.id}`;
            await this.cacheManager.set(cacheKey,product.quantity-orderQuantity);

            product.quantity-=orderQuantity;
            await this.productRepo.save(product);

        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Error updating product quantity', error);
        }
    }

    // get product quantity
    async getProductQuantity(productId: string): Promise<number>{

        try {
            const product=await this.productRepo.findOne({
                where:{id:productId}
            });

            if(!product) throw new NotFoundException('Product not found');

            return product.quantity;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Error updating product quantity', error);
        }
    }
}
