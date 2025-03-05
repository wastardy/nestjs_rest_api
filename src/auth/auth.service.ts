import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signup() {
    return {
      message: 'signup service called',
    };
  }

  signin() {
    return {
      message: 'signin service called',
    };
  }
}
