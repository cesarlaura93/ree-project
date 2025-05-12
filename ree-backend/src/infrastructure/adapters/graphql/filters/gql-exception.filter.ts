import { Catch, ArgumentsHost } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { ErrorResponse } from 'src/infrastructure/adapters/graphql/dto/error-response.dto';

@Catch()
export class MyGqlExceptionFilter implements GqlExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): GraphQLError {
    const ctx = GqlArgumentsHost.create(host);
    const { message, code, details, timestamp } = this.parseException(exception);

    return new GraphQLError(message, {
      extensions: {
        code: code,
        details: details,
        timestamp: timestamp
      }
    });
  }

  private parseException(exception: Error): ErrorResponse {
    if (exception['response']) {
      if (exception['response'].message?.isArray) {
        return {
          message: 'Validation Error',
          code: 'VALIDATION_ERROR',
          details: exception['response'].message.map(err => ({
            field: err.property,
            message: Object.values(err.constraints)[0]
          })),
          timestamp: new Date().toISOString()
        };
      }
      return {
        message: exception['response'].message || 'Error desconocido',
        code: exception['response'].code || 'INTERNAL_ERROR',
        details: exception['response'].details,
        timestamp: new Date().toISOString(),
      };
    }
    
    return {
      message: exception.message,
      code: this.mapErrorCode(exception),
      details: undefined,
      timestamp: new Date().toISOString(),
    };
  }

  private mapErrorCode(exception: Error): string {
    const errorMap = {
      ValidationError: 'VALIDATION_ERROR',
      NotFoundError: 'NOT_FOUND',
      ConflictError: 'CONFLICT',
    };
    return errorMap[exception.name] || 'INTERNAL_ERROR';
  }
}