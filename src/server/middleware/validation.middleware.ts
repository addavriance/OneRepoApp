import {Request, Response, NextFunction} from 'express';
import {z, ZodFormattedError} from 'zod';

export function validateBody(schema: z.ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const requiredFields = getRequiredFieldsFromSchema(schema);
            const missingFields = requiredFields.filter(field => !req.body || req.body[field] === undefined);

            if (missingFields.length > 0) {
                const missingFieldsErrors = Object.fromEntries(
                    missingFields.map(field => [field, `${field} is required`])
                );

                return res.status(400).json({
                    error: true,
                    messages: missingFieldsErrors,
                    code: 400,
                });
            }

            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: true,
                    messages: formatZodError(error),
                    code: 400,
                });
            }

            return res.status(500).json({
                error: true,
                message: "Internal server error (validator)",
                code: 500,
            });
        }
    };
}

export function validateParams(schema: z.ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const requiredFields = getRequiredFieldsFromSchema(schema);
            const missingFields = requiredFields.filter(field => !req.params || req.params[field] === undefined);

            if (missingFields.length > 0) {
                const missingFieldsErrors = Object.fromEntries(
                    missingFields.map(field => [field, `${field} is required`])
                );

                return res.status(400).json({
                    error: true,
                    messages: missingFieldsErrors,
                    code: 400,
                });
            }

            schema.parse(req.params);

            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: true,
                    messages: formatZodError(error),
                    code: 400,
                });
            }

            return res.status(500).json({
                error: true,
                message: "Internal server error (params validator)",
                code: 500,
            });
        }
    };
}

export function validateQuery(schema: z.ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const requiredFields = getRequiredFieldsFromSchema(schema);
            const missingFields = requiredFields.filter(field => !req.query || req.query[field] === undefined);

            if (missingFields.length > 0) {
                const missingFieldsErrors = Object.fromEntries(
                    missingFields.map(field => [field, `${field} is required`])
                );

                return res.status(400).json({
                    error: true,
                    messages: missingFieldsErrors,
                    code: 400,
                });
            }

            schema.parse(req.query);

            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: true,
                    messages: formatZodError(error),
                    code: 400,
                });
            }

            return res.status(500).json({
                error: true,
                message: "Internal server error (query validator)",
                code: 500,
            });
        }
    };
}

function getRequiredFieldsFromSchema(schema: z.ZodSchema): string[] {
    if (schema instanceof z.ZodObject) {
        const shape = schema.shape;
        const requiredFields: string[] = [];

        for (const key in shape) {
            const fieldSchema = shape[key];

            if (isFieldRequired(fieldSchema)) {
                requiredFields.push(key);
            }
        }

        return requiredFields;
    }

    return [];
}

function isFieldRequired(fieldSchema: z.ZodTypeAny): boolean {
    if (fieldSchema instanceof z.ZodString) {
        return true;
    }

    if (fieldSchema instanceof z.ZodOptional) {
        return false;
    }

    if (fieldSchema instanceof z.ZodNullable) {
        return false;
    }

    if (fieldSchema instanceof z.ZodObject) {
        return true;
    }

    return true;
}

function formatZodError(error: z.ZodError) {
    const errorObject = z.treeifyError(error) as ZodFormattedError;

    const flattenedErrors: Record<string, string> = {};
    if (errorObject.properties) {
        for (const key in errorObject.properties) {
            const fieldErrors = errorObject.properties[key].errors;
            if (fieldErrors && fieldErrors.length > 0) {
                flattenedErrors[key] = fieldErrors[0];
            }
        }
    }

    return flattenedErrors;
}
