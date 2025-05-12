import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType('ErrorDetail')
export class ErrorDetail {
  @Field(() => String)
  field: string;
  
  @Field(() => String)
  message: string;
}

@ObjectType('ErrorResponse')
export class ErrorResponse {
  @Field(() => String, {
    description: 'message',
  })
  message: string;

  @Field(() => String, {
    description: 'cod error',
  })
  code: string;

  @Field(() => String, {
    description: 'date  error',
  })
  timestamp: string;

  @Field(() => [ErrorDetail], { nullable: true })
  details?: ErrorDetail[];
}