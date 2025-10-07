import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EtherJsHost } from './etherJsHost';
import { NotificationController } from './notification.controller';
import { FirebaseCloudMessaging } from './firebaseCloudMessaging';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, NotificationController],
  providers: [AppService, EtherJsHost, FirebaseCloudMessaging],
})
export class AppModule {}
