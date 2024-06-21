import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

/**
 * Exemplo do field middleware - https://docs.nestjs.com/graphql/field-middleware
 * @param ctx
 * @param next
 * @returns
 */
export const fieldNumericMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const value = await next();
  console.log(value);
  return value;
};
