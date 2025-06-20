import { Controller, Get, Param } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ParseIntPipe } from '../pipes/parse-int.pipe';

const RPC_URL = 'https://sei-m.rpc.n0ok.net:443';

@Controller('cosmos')
export class CosmosController {
  constructor(private readonly httpService: HttpService) {}

  @Get('block/:height')
  async getBlock(@Param('height', ParseIntPipe) height: number) {
    const { data } = await firstValueFrom(
      this.httpService.get(`${RPC_URL}/block?height=${height}`),
    );
    const block = data.result.block;
    const blockId = data.result.block_id.hash;
    return {
      height: parseInt(block.header.height, 10),
      time: block.header.time,
      hash: blockId,
      proposedAddress: block.header.proposer_address,
    };
  }

  @Get('transactions/:hash')
  async getTransaction(@Param('hash') hash: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(`${RPC_URL}/cosmos/tx/v1beta1/txs/${hash}`),
    );
    const tx = data.tx_response;
    return {
      hash: tx.txhash,
      height: parseInt(tx.height, 10),
      time: tx.timestamp,
      gasUsed: parseInt(tx.gas_used, 10),
      gasWanted: parseInt(tx.gas_wanted, 10),
      fee: tx.tx.auth_info.fee.amount,
      sender: tx.tx.body.messages[0]?.from_address,
    };
  }
}