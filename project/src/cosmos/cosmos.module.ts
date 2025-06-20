import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CosmosController } from './cosmos.controller';

@Module({
  imports: [HttpModule],
  controllers: [CosmosController],
})
export class CosmosModule {}