import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';

const RolesGuard = (roles: string[]): Type<CanActivate> => {
  class RolesGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      return user && roles.includes(user.role);
    }
  }
  return mixin(RolesGuardMixin);
}

export default RolesGuard;
