import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor( private _authService : AuthService ){}
  canActivate(
    context: ExecutionContext,
    
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log("token found or not",request.headers.authorization)
    if (!request.headers.authorization) {
      throw new UnauthorizedException({ status: 401, message: "Missing token into request header!" })
    }

    const token = request.headers.authorization.split(' ')[1];
    this._authService.decodeJWTToken( token ).then((data)=>{
      request.user = data 
    })

    try {
      let isAlive
      isAlive = this._authService.verifyJWTToken(token)
      if (isAlive) {
        return true;
      }
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        console.log("token", err.name);
        
        throw new ForbiddenException({ status: 401, message: "Token Expired" })
      }
      if (err.name === "JsonWebTokenError") {
        console.log("token", err.name);
        throw new ForbiddenException({ status: 403, message: "Token Invalid"})
      }

    }

    return true;
  }
}
