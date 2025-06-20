import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EvmController } from './evm.controller';

@Module({
  imports: [HttpModule],
  controllers: [EvmController],
})
export class EvmModule {}