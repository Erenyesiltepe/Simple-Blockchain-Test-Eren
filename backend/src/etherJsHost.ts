import { Injectable, OnModuleInit } from "@nestjs/common";
import { InfuraProvider, Contract, EventLog } from "ethers";
import { ConfigService } from "@nestjs/config";
import { FirebaseCloudMessaging } from './firebaseCloudMessaging';

@Injectable()
export class EtherJsHost implements OnModuleInit {
  private provider: InfuraProvider;
  private contract: Contract;
  private deviceTokens: string[] = [];
  //private tokenDecimals: number;
  
  private readonly contractAbi = [
    "event Transfer(address indexed from, address indexed to, uint value)",
    //"function decimals() view returns (uint8)"
  ];

  constructor(
    private configService: ConfigService,
    private firebaseMessaging: FirebaseCloudMessaging
  ) {
    this.provider = new InfuraProvider(
      "mainnet", 
      this.configService.get<string>('INFURA_API_KEY')
    );
  }

  // Method to register a new device token
  async addDeviceToken(token: string) {
    if (!this.deviceTokens.includes(token)) {
      this.deviceTokens.push(token);
    }
  }

  // Method to get all registered device tokens
  private async getDeviceTokens(): Promise<string[]> {
    return this.deviceTokens;
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

    
    this.contract.on("Transfer", async (from: string, to: string, value: bigint, event: EventLog) => {
      try {
        const actualValue = Number(value) / 1e6;

        // Send notification for large transfers (e.g., > 100,000 USDT)
        if (actualValue > 100000) {
          console.log({
            event: 'Transfer',
            from,
            to,
            actualValue: actualValue,
            hash: event.transactionHash
        });
          // Get the registered device tokens from your storage/service
          const tokens = await this.getDeviceTokens(); // You'll need to implement this method
          
          await this.firebaseMessaging.sendTransferNotification(
            from,
            to,
            actualValue,
            event.transactionHash,
            tokens
          );
        }
      } catch (error) {
        console.error('Failed to process transfer event:', error);
      }
    });

    console.log(`Started listening to contract: ${contractAddress}`);
  }
}