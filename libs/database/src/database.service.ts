import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnApplicationBootstrap {
    constructor(
        private readonly dataSource:DataSource
    ) {}

    async onApplicationBootstrap() {
        try {
            if(!this.dataSource.isInitialized){
                await this.dataSource.initialize();
            }
            console.log('PostgreSQL connected successfully');
        } catch (error) {
            console.error('Error connecting PostgreSQL ', error);
        }
    }
}
