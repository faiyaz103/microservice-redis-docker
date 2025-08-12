import { NestFactory } from '@nestjs/core';
import { ProductModule } from './product.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
    const app = await NestFactory.create(ProductModule);

    app.connectMicroservice<MicroserviceOptions>({
        transport:Transport.REDIS,
        options:{
            host:'localhost',
            port:3001
        }
    });
    
    app.useGlobalPipes(new ValidationPipe());

    await app.startAllMicroservices();
    await app.listen(3000);
}
bootstrap();
