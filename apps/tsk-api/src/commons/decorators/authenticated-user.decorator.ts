import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthenticatedUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    console.log(data, '<< authenticated user decorator');

    const request = ctx.switchToHttp().getRequest();

    const user = request.user;

    if (data) {
      return user?.[data];
    }

    return user;
  },
);
