import { Controller, Get, Param } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ParseIntPipe } from '../pipes/parse-int.pipe';

const RPC_URL = 'https://sei-evm-rpc.publicnode.com';

@Controller('evm')
export class EvmController {
  constructor(private readonly httpService: HttpService) {}

  @Get('block/:height')
  async getBlock(@Param('height', ParseIntPipe) height: number) {
    const hexHeight = '0x' + height.toString(16);
    const payload = { jsonrpc: '2.0', method: 'eth_getBlockByNumber', params: [hexHeight, false], id: 1 };
    const { data } = await firstValueFrom(this.httpService.post(RPC_URL, payload));
    const block = data.result;
    return {
      height: parseInt(block.number, 16),
      hash: block.hash,
      parentHash: block.parentHash,
      gasLimit: parseInt(block.gasLimit, 16),
      gasUsed: parseInt(block.gasUsed, 16),
      size: parseInt(block.size, 16),
    };
  }

  @Get('transactions/:hash')
  async getTransaction(@Param('hash') hash: string) {
    const payload = { jsonrpc: '2.0', method: 'eth_getTransactionByHash', params: [hash], id: 1 };
    const { data } = await firstValueFrom(this.httpService.post(RPC_URL, payload));
    const tx = data.result;
    return {
      hash: tx.hash,
      to: tx.to,
      from: tx.from,
      value: tx.value,
      input: tx.input,
      maxFeePerGas: tx.maxFeePerGas,
      maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
      gasPrice: tx.gasPrice,
    };
  }
}