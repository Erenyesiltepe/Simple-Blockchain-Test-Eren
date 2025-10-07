import { Injectable, OnModuleInit } from "@nestjs/common";
import { WebSocketProvider, Contract, EventLog } from "ethers";
import { ConfigService } from "@nestjs/config";
import { FirebaseCloudMessaging } from './firebaseCloudMessaging';

@Injectable()
export class EtherJsHost implements OnModuleInit {
  private provider: WebSocketProvider;
  private contract: Contract;
  private deviceTokens: string[] = [];
  
  private readonly contractAbi = [
    "event Transfer(address indexed from, address indexed to, uint value)"
  ];

  constructor(
    private configService: ConfigService,
    private firebaseMessaging: FirebaseCloudMessaging
  ) {
    const infuraKey = this.configService.get<string>('INFURA_API_KEY');
    const wsUrl = `wss://mainnet.infura.io/ws/v3/${infuraKey}`;
    this.provider = new WebSocketProvider(wsUrl);
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
    
    this.contract.on("Transfer", async (from: string, to: string, value: bigint, event: any) => {
      try {
        const actualValue = Number(value) / 1e6;
        
        // Try multiple ways to get transaction hash
         let transactionHash = event.log?.transactionHash;
        
        console.log('Transfer detected:', {
          from,
          to,
          value: actualValue,
          hash: transactionHash,
        });
        
        if (actualValue > 100000) {
          // Get the registered device tokens from your storage/service
          const tokens = await this.getDeviceTokens();
          
          if (tokens.length > 0 && transactionHash) {
            await this.firebaseMessaging.sendTransferNotification(
              from,
              to,
              actualValue,
              transactionHash,
              tokens
            );
          } else if (!transactionHash) {
            console.error('Cannot send notification: transaction hash not available');
          }
        }
      } catch (error) {
        console.error('Failed to process transfer event:', error);
      }
    });

    console.log(`Started listening to contract: ${contractAddress}`);
  }
}