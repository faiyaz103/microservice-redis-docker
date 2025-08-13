import { Module } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv, Keyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';

@Module({
    imports: [
        CacheModule.registerAsync({
            useFactory:async()=>({
                stores: [
                    new Keyv({
                        store: new CacheableMemory({
                            ttl:60000,
                            lruSize: 5000
                        })
                    }),
                    createKeyv('redis://localhost:6379')
                ]
            }),
            isGlobal: true
        })
    ],
    providers: [RedisCacheService],
    exports: [RedisCacheService, CacheModule],
})
export class RedisCacheModule {}
