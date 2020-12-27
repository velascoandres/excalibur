import {ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger} from '@nestjs/common';
import {Request, Response} from 'express';

export interface IErrorPayload {
    error: any;
    message: string;
    data?: any;
}


export abstract class DataBaseException {
    protected payload: IErrorPayload;

    protected constructor(payload: any) {
        this.payload = payload;
    }

    get erroPayload() {
        return this.payload;
    }
}


export class CreateOneException extends DataBaseException {
    constructor(payload: any, status?: number) {
        super(payload);
    }
}

export class UpdateOneException extends DataBaseException {
    constructor(payload: any, status?: number) {
        super(payload);
    }
}

export class DeleteOneException extends DataBaseException {
    constructor(payload: any, status?: number) {
        super(payload);
    }
}

export class FindAllException extends DataBaseException {
    constructor(payload: any, status?: number) {
        super(payload);
    }
}

export class FindOneByIdException extends DataBaseException {
    constructor(payload: any, status?: number) {
        super(payload);
    }
}

export class FindOneException extends DataBaseException {
    constructor(payload: any, status?: number) {
        super(payload);
    }
}

export class CreateManyException extends DataBaseException {
    constructor(payload: any, status?: number) {
        super(payload);
    }
}

export class CreateIndexException extends DataBaseException {
    constructor(payload: any, status?: number) {
        super(payload);
    }
}

@Catch(CreateOneException, UpdateOneException, DeleteOneException, FindAllException, FindOneByIdException, CreateManyException)
export class CrudFilterException implements ExceptionFilter {
    debug: boolean;

    constructor(debug: boolean = false) {
        this.debug = debug;
    }

    catch(exception: DataBaseException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const {message, error} = exception.erroPayload;
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        const isCreateException = exception instanceof CreateOneException;
        const isUpdateOneException = exception instanceof UpdateOneException;
        const isDeleteOneException = exception instanceof DeleteOneException;
        const isFindAllException = exception instanceof FindAllException;
        const isFindOneByIdException = exception instanceof FindOneByIdException;
        const isCreateManyException = exception instanceof CreateManyException;
        if (isCreateException || isUpdateOneException || isDeleteOneException || isCreateManyException) {
            status = HttpStatus.BAD_REQUEST;
        }
        if (isFindAllException || isFindOneByIdException) {
            status = HttpStatus.NOT_FOUND;
        }
        const logger = new Logger();
        logger.error(message);
        if (this.debug) {
            logger
                .debug(
                    error,
                );
        }
        console.error(error);
        response
            .status(status)
            .json(
                {
                    message,
                    statusCode: status,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                },
            );
    }
}