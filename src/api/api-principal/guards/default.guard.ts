import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

export class DefaultGuard implements CanActivate {
    canActivate(
      context: ExecutionContext,
    ): boolean {
      return true;
    }
  }