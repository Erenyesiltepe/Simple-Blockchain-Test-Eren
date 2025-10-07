import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import path from 'path/win32';

@Injectable()
export class FirebaseCloudMessaging {
  constructor(private configService: ConfigService) {
    const serviceAccountPath = path.join(__dirname,'..', 'src', 'vinutask-b0cc2-firebase-adminsdk-fbsvc-31cc927dbc.json');
    console.log('Service Account Path:', serviceAccountPath);
    const serviceAccount = require(serviceAccountPath);
    console.log('Service Account:', serviceAccount);

    if (!serviceAccount) {
      throw new Error('Firebase service account not found in environment variables');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }

  async sendNotification(title: string, body: string, tokens: string[]) {
    try {
      const message = {
        notification: {
          title,
          body,
        },
      };

      const responses = await Promise.all(
        tokens.map(token =>
          admin.messaging().send({
            ...message,
            token: token // Send to individual token
          })
        )
      );

      console.log('Successfully sent messages:', responses);
      
      // Handle any failed tokens
      const failedTokens = tokens.filter((token, index) => {
        try {
          return !responses[index];
        } catch {
          return true;
        }
      });

      if (failedTokens.length > 0) {
        console.log('List of tokens that caused failures:', failedTokens);
      }
      
      return responses;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Method to send notification for large transfers
  async sendTransferNotification(from: string, to: string, amount: number, hash: string, tokens: string[]) {
    const title = 'Large Transfer Detected';
    const body = `${amount.toFixed(2)} tokens transferred from ${from.slice(0, 8)}...`;
    
    return this.sendNotification(title, body, tokens);
  }
}