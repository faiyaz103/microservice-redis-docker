import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
            imports:[ConfigModule],
            inject:[ConfigService],
            useFactory: async(configService:ConfigService)=>({
                type:'postgres',
                host:configService.get('DB_HOST') || 'localhost',
                port:parseInt(configService.get('DB_PORT') || '5432', 10),
                username:configService.get('DB_USERNAME'),
                password:configService.get('DB_PASSWORD'),
                database:configService.get('DB_NAME'),
                autoLoadEntities:true,
                synchronize:true
            }),
        }),
    ],
    providers: [DatabaseService],
    exports: [DatabaseService, TypeOrmModule],
})
export class DatabaseModule {}
