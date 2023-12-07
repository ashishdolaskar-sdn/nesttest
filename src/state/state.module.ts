import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StateController } from './state.controller';
import { StateService } from './state.service';
import { IMstatesSchema } from './state.model';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios'; // Update this line


@Module({
  imports: [HttpModule,
    MongooseModule.forFeature([{ name: 'signup', schema: IMstatesSchema }]),
    JwtModule.register({
      secret: 'yourSecretKey', // Change this to the same secret key as in AppModule
      signOptions: { expiresIn: '1h' }, // Adjust the expiration time as needed
    }),
  ],
  
  controllers: [StateController],
  providers: [StateService],
})
export class StateModule {}
