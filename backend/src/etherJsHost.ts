import { Injectable, OnModuleInit } from "@nestjs/common";
import { InfuraProvider, Contract, EventLog } from "ethers";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EtherJsHost implements OnModuleInit {
  private provider: InfuraProvider;
  private contract: Contract;
  //private tokenDecimals: number;
  
  private readonly contractAbi = [
    "event Transfer(address indexed from, address indexed to, uint value)",
    //"function decimals() view returns (uint8)"
  ];

  constructor(private configService: ConfigService) {
    this.provider = new InfuraProvider(
      "mainnet", 
      this.configService.get<string>('INFURA_API_KEY')
    );
  }

  async onModuleInit() {
    const contractAddress = this.configService.get<string>('CONTRACT_ADDRESS');
    
    if (!contractAddress) {
      throw new Error('CONTRACT_ADDRESS not found in environment variables');
    }

    this.contract = new Contract(
      contractAddress,
      this.contractAbi,
      this.provider
    );

    // Get the token decimals first
    // try {
    //   this.tokenDecimals = await this.contract.decimals();
    //   console.log(`Token decimals: ${this.tokenDecimals}`);
    // } catch (error) {
    //   console.error('Failed to get token decimals:', error);
    //   this.tokenDecimals = 18; // fallback to standard ERC20 decimals
    // }

    
    this.contract.on("Transfer", (from: string, to: string, value: bigint, event: EventLog) => {
      try{
        const actualValue = Number(value) / 1e6;
        console.log({
            event: 'Transfer',
            from,
            to,
            actualValue: actualValue
        });
      } catch (error) {
        console.error('Failed to calculate actual value:', error);
      }
      
    });

    console.log(`Started listening to contract: ${contractAddress}`);
  }
}