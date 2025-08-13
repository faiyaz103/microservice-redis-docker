import { BadRequestException, Inject, Injectable, InternalServerErrorException, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { catchError, firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderEntity) private orderRepo:Repository<OrderEntity>,
        @Inject('PRODUCT_SERVICE') private readonly productClient:ClientProxy,
        @Inject(CACHE_MANAGER) private cacheManager:Cache
    ){};

    // create new Order
    async addOrder(createOrderDto: CreateOrderDto): Promise<CreateOrderDto>{

        try {

            // check product quantity in the cache
            const cacheKey=`product_qty_${createOrderDto.product_id}`;
            let productQty=await this.cacheManager.get<Number>(cacheKey);

            if(productQty!==undefined) console.log('[CACHE HIT]');

            // if cache miss then fetch it from product service method
            if(productQty===undefined){
                // emit event to product service to get quantity
                console.log('[CACHE MISS]');
                
                productQty=await firstValueFrom(
                    this.productClient.send('get-product-quantity', {
                        productId:createOrderDto.product_id
                    }).pipe(
                        timeout(5000),
                        catchError(()=>{
                            throw new ServiceUnavailableException('Error getting product quantity');
                        })
                    )
                );
            }

            console.log('Product quantity', productQty);

            if(createOrderDto.quantity > Number(productQty)) throw new BadRequestException('Not enough products');

            const order=this.orderRepo.create(createOrderDto);
            const savedOrder=await this.orderRepo.save(order);

            // emit event to product service to update quantity
            this.productClient.emit('update-product-quantity', {
                productId:createOrderDto.product_id,
                quantity:createOrderDto.quantity
            });

            return order;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Error creating order ', error);
        }
    }

    // get Order by ID
    async findOrderById(id: string): Promise<CreateOrderDto>{

        try {
            const order=await this.orderRepo.findOne({
                where:{id}
            });

            return order as CreateOrderDto;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Error fetching order ', error);
        }
    }

    // get Order by ID
    async findOrders(): Promise<CreateOrderDto[]>{

        try {
            const orders=await this.orderRepo.find();

            return orders;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Error fetching orders ', error);
        }
    }

    // delete Order by ID
    async deleteOrder(id: string): Promise<string>{

        try {
            await this.orderRepo.delete(id);

            return 'Deleted successfully';
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Error deleting order ', error);
        }
    }
}
