import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Request } from "express"; 
import { JwtService } from "@nestjs/jwt";
import { UtilService } from "../../services/util.service";

export class AuthGuard implements CanActivate {

    constructor(private readonly jwtSvc: JwtService, private readonly utilSvc: UtilService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Obtener el request de la petición
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        // Verificar el token
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            console.log(token);
            // TODO: Si el token existe verificar el tiempo de expiracion
            const payload = await this.utilSvc.getPayloadFromJWT(token);

            // TODO: Si el token es funcional obtener el user (payload)
            request['user'] = payload;
            
            // TODO: Devolver el resultado
            return true;
        } catch (error) {
            // Si el token falló por expiración o firma
            throw new UnauthorizedException();
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            return undefined;
        }

        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : undefined;
    }
}