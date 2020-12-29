import {ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger} from '@nestjs/common';
import {Request, Response} from 'express';
import {LoggerService} from '../services/logger.service';

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

    get errorPayload() {
        return this.payload;
    }
}


export class CreateOneException extends DataBaseException {
    constructor(payload: IErrorPayload, status?: number) {
        super(payload);
    }
}

export class UpdateOneException extends DataBaseException {
    constructor(payload: IErrorPayload, status?: number) {
        super(payload);
    }
}

export class UpdateManyException extends DataBaseException {
    constructor(payload: IErrorPayload, status?: number) {
        super(payload);
    }
}

export class DeleteOneException extends DataBaseException {
    constructor(payload: IErrorPayload, status?: number) {
        super(payload);
    }
}

export class DeleteManyException extends DataBaseException {
    constructor(payload: IErrorPayload, status?: number) {
        super(payload);
    }
}

export class FindAllException extends DataBaseException {
    constructor(payload: IErrorPayload, status?: number) {
        super(payload);
    }
}

export class FindOneByIdException extends DataBaseException {
    constructor(payload: IErrorPayload, status?: number) {
        super(payload);
    }
}

export class FindOneException extends DataBaseException {
    constructor(payload: IErrorPayload, status?: number) {
        super(payload);
    }
}

export class CreateManyException extends DataBaseException {
    constructor(payload: IErrorPayload, status?: number) {
        super(payload);
    }
}

export class CreateIndexException extends DataBaseException {
    constructor(payload: IErrorPayload, status?: number) {
        super(payload);
    }
}

@Catch(
    CreateOneException,
    UpdateOneException,
    DeleteOneException,
    FindAllException,
    FindOneByIdException,
    CreateManyException,
    DeleteManyException,
    UpdateManyException,
)
export class CrudFilterException implements ExceptionFilter {
    debug: boolean;

    constructor(debug: boolean = false) {
        this.debug = debug;
    }

    catch(exception: DataBaseException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const {message, error, data} = exception.errorPayload;
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        const isCreateException = exception instanceof CreateOneException;
        const isUpdateOneException = exception instanceof UpdateOneException;
        const isDeleteOneException = exception instanceof DeleteOneException;
        const isFindAllException = exception instanceof FindAllException;
        const isFindOneByIdException = exception instanceof FindOneByIdException;
        const isCreateManyException = exception instanceof CreateManyException;
        const isDeleteManyException = exception instanceof DeleteManyException;
        const isUpdateManyException = exception instanceof UpdateManyException;

        const isCreateError = isCreateException || isCreateManyException;
        const isUpdateError = isUpdateOneException || isUpdateManyException;
        const isDeleteError = isDeleteOneException || isDeleteManyException;
        const isFindError = isFindOneByIdException || isFindAllException;

        if (isCreateError || isUpdateError || isDeleteError) {
            status = HttpStatus.BAD_REQUEST;
        }
        if (isFindError) {
            status = HttpStatus.NOT_FOUND;
        }
        const path = request.route.path;
        const method = request.method;
        const context = `${method} ${path}`;
        const logger = LoggerService.getInstance().logger;
        logger.error(message, '', context);
        if (this.debug) {
            logger.debug(error, context);
            logger.debug(data, context);
        }
        response
            .status(status)
            .json(
                {
                    message,
                    statusCode: status,
                    timestamp: new Date().toISOString(),
                },
            );
    }
}