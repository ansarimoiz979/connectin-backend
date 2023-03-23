import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
export const jwtConstants = {
  secret: 'secretKey',
};

@Global()
@Module({
  imports: [ UserModule,
    JwtModule.register({ secret: jwtConstants.secret,
        signOptions: { expiresIn: '6000s' }
       })
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports : [ AuthService , JwtModule ]
})
export class AuthModule {}
