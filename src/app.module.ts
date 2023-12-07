import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StateModule } from './state/state.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRoot(
      // 'mongodb+srv://imdev:r3BEZ9IYchLah1Ej@cluster0.ggzsi.mongodb.net',
      'mongodb://127.0.0.1:27017/test',
    ),
    JwtModule.register({
      secret: 'yourSecretKey', // Change this to a secure secret key
      signOptions: { expiresIn: '1h' }, // Adjust the expiration time as needed
    }),
    StateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
