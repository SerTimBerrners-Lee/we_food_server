import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

/// имплемнетация !!!
@Injectable()
export class JwtAuth implements CanActivate {

    constructor(
        private jwtService: JwtService,
    ) {}
    
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();

        console.log("req.hostname:", req.hostname)

        if (this.tryPath(req.hostname)) return true;
        
        try {
            const token = this.getToken(req.headers.authorization);
            if (!token)
                throw new UnauthorizedException({success: false, error: 'Пользователь не авторизован'});

            const user = this.jwtService.verify(token);
            return user?.id && true ? user : null;
        } catch (e) {
            console.error(e);
            throw new UnauthorizedException({success: false, error: 'Пользователь не авторизован'});
        }
    }

    private getToken(authHeader: string): string {
        const bearer = authHeader.split(' ')[0];
        const token = authHeader.split(' ')[1];
    
        if (bearer !== 'Bearer' || !token || token == 'undefined')
            return '';
    
        return token;
    }

    private tryPath(path: string) {
        switch (path) {
            case 'localhost':
                return true;
            case '/api/login_crm':
                return true;
            case '/product_line/actuallity':
                return true;
            case '/auth-by-phone':
                return true;
            case '/confirmation-code':
                return true;
            default:
                return false;
        }
    }
}