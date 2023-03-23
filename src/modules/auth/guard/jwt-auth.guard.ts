import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtservice:JwtService, private _authService : AuthService ){}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      throw new UnauthorizedException({ status: 401, message: "Missing token into request header!" })
    }

    const token = request.headers.authorization.split(' ')[1];
    this._authService.decodeJWTToken( token ).then((data)=>{
      request.user = data 
    })
    try {
      let isAlive
      isAlive = this.jwtservice.verify(token)
      if (isAlive) {
        return true;
      }
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        throw new ForbiddenException({ status: 401, message: "Token Expired" })
      }
      if (err.name === "JsonWebTokenError") {
        throw new ForbiddenException({ status: 403, message: "Token Invalid"})
      }

    }
  }
}


