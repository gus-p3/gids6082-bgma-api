import { HttpException, HttpStatus } from "@nestjs/common";

export class AppException extends HttpException{
    constructor(public readonly statusCode:HttpStatus = HttpStatus.BAD_REQUEST,
        public readonly message: string,
        public readonly errorCode: string
    ){
        super(message, statusCode);
    }
}