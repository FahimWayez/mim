import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesModule } from './messages/messages.module';
import { MojoMutkiController } from './mojo-mutki/mojo-mutki.controller';
import { InventoryController } from './inventory/inventory.controller';
import { MojoMutkiService } from './mojo-mutki/mojo-mutki.service';
import { InventoryService } from './inventory/inventory.service';

// if (!process.env.MONGO_URI) {
//   throw new Error('MONGO_URI is not defined in the environment variables');
// }

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: () => {
        if (!process.env.MONGO_URI) {
          throw new Error(
            'MONGO_URI is not defined in the environment variables',
          );
        }
        return { uri: process.env.MONGO_URI };
      },
    }),
    MessagesModule,
  ],
  controllers: [MojoMutkiController, InventoryController],
  providers: [MojoMutkiService, InventoryService],
})
export class AppModule {}
