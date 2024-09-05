import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { VetrinaModule } from './vetrina/vetrina.module';
import { SkladModule } from './sklad/sklad.module';
import { BozorModule } from './bozor/bozor.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}), 
    JwtModule.register({global: true}), 
    AuthModule,
    VetrinaModule,
    SkladModule,
    BozorModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
