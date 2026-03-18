import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { User } from "../generated/prisma/client";

@Injectable()
export class UtilService {
    constructor(
        private jwtService: JwtService
    ) { }


    public async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    public async checkPassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    public async getPayload(user: User): Promise<any> {
        return {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            username: user.username,
            created_dt: user.created_dt
        }
    }


    public async getPayloadFromJWT(token: string): Promise<any> {
        return await this.jwtService.verifyAsync(token);
    }


    public async generateToken(payload: any, expiresIn: any = '10000s'): Promise<string> {
        const jwt = await this.jwtService.signAsync(payload, {
            expiresIn: expiresIn as any
        });
        return jwt;
    }
}