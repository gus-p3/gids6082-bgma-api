import { 
  ArgumentsHost, 
  Catch, 
  ExceptionFilter, 
  HttpException, 
  HttpStatus 
} from "@nestjs/common";

@Catch()
export class AllException implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        // Verificamos el status
        const status = exception instanceof HttpException 
            ? exception.getStatus() 
            : HttpStatus.INTERNAL_SERVER_ERROR;

        // Extraemos el mensaje
        const message = exception instanceof HttpException 
            ? exception.getResponse() 
            : 'Internal server error';

        // Enviamos la respuesta estructurada
        response.status(status).json({
            statusCode: status,
            timeStamp: new Date().toISOString(),
            path: request.url,
            error: typeof message === 'string' ? message : (message as any).message || message,
            errorCode: exception.code || 'UNKNOWN_ERROR'
        });
    }
}