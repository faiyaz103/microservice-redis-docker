import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity) private productRepo: Repository<ProductEntity>
    ){}
    
    // create new product
    async addProduct(createProductDto: CreateProductDto): Promise<CreateProductDto>{

        try {
            const product=this.productRepo.create(createProductDto);
            const savedProduct=await this.productRepo.save(product);

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

        if(product.quantity<orderQuantity) throw new Error('Insufficient Products');

        try {
            product.quantity-=orderQuantity;
            await this.productRepo.save(product);

        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Error updating product quantity', error);
        }
    }
}
