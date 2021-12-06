import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/modules/auth/services/auth.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(
        private readonly authService : AuthService
    ){}
    async use(req: Request, res: Response, next: NextFunction) {
        if (req.headers.authorization) {
            const tokenFromClient = req.headers.authorization.split(' ')[1] 
            var {isValid,mess} = await this.authService.verifyToken(tokenFromClient)
            if(!isValid){
                return  res.status(401).json({message: mess}) 
            }
                      
            
        }else{
            return res.status(401).json({
                message:'Token not found'
            })
        }      
        next();
    }
}
