import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserEntity } from './modules/user/entities/user.entity';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type : 'postgres',
      host: "127.0.0.1",
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: "linkedin",
      entities : [
        UserEntity
      ],
      synchronize : true
    }),
    AuthModule,
    UserModule
  ],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(){
    console.log("app module",process.env.POSTGRES_HOST);    
  }
}
