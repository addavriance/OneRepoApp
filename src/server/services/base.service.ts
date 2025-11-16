import { MongoError, MongoServerError } from "mongodb";
import { Result } from "../../shared/interfaces";
import { Error as MongooseError } from "mongoose";

function fixValidationMessage(message) {
    const requiredPattern = /^Path `(\w+)` is required\.$/;

    const lengthPattern = /^Path `(\w+)` \([^)]+\) is (.+)$/;

    if (requiredPattern.test(message)) {
        return message.replace(requiredPattern, "Field '$1' is required.");
    }

    if (lengthPattern.test(message)) {
        return message.replace(lengthPattern, "Field '$1' is $2");
    }

    return message;
}

export class ServiceError extends Error {
    constructor(
        public message: string,
        public code: number = 400,
    ) {
        super(message);
    }
}

export abstract class BaseService {

    protected async executeService<TResult>(
        operation: () => Promise<TResult>
    ): Promise<Result & { data?: TResult }> {
        try {
            const data = await operation();

            return {
                error: false,
                messages: {},
                code: 200,
                ...data
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    protected handleError(error: MongoError): Result {
        if (error instanceof MongooseError.ValidationError) {
            const messages: { [key: string]: string } = {};
            Object.keys(error.errors).forEach(field => {
                const err = error.errors[field];
                if (err instanceof MongooseError.ValidatorError) {
                    messages[field] = fixValidationMessage(err.properties.message);
                }
            });

            return {
                error: true,
                messages,
                code: 400
            };
        }

        if (error.code === 11000 && error instanceof MongoServerError) {
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];
            return {
                error: true,
                messages: {
                    [field]: `${field} '${value}' already exists`
                },
                code: 400
            };
        }

        if (error instanceof ServiceError) {
            return {
                error: true,
                messages: { service: error.message },
                code: error.code
            }
        }

        console.error('Service error:', error);
        return {
            error: true,
            messages: { server: 'Internal server error' },
            code: 500
        };
    }
}
