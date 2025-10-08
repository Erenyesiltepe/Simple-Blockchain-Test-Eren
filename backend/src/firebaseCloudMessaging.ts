import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import path from 'path/win32';

@Injectable()
export class FirebaseCloudMessaging {
  constructor(private configService: ConfigService) {
    const serviceAccountPath = path.join(__dirname,'..', 'src', 'firebase_credential.json');
    const serviceAccount = require(serviceAccountPath);

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
    const body = JSON.stringify({amount: amount, from: from, to: to, hash: hash});
    
    return this.sendNotification(title, body, tokens);
  }
}