import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
// import { User, Bookmark } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    // generate the password
    const hash = await argon.hash(dto.password);

    try {
      // save user
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      // return saved user
      return {
        message: 'signup service called',
        user: await this.signToken(user.id, user.email),
      };
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException(
            'These credentials are already taken',
          );
        }
      }

      throw err;
    }
  }

  async signin(dto: AuthDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!user)
        throw new ForbiddenException(
          'Credentials Incorrect',
        );

      const passwordsMatches = await argon.verify(
        user.hash,
        dto.password,
      );

      if (!passwordsMatches)
        throw new ForbiddenException('Password Incorrect');

      return {
        message: 'signin service called',
        user: await this.signToken(user.id, user.email),
      };
    } catch (err) {
      console.log(err);
    }
  }

  signToken(
    userId: number,
    email: string,
  ): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    return this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });
  }
}
