import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';

import { AuthDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    // TODO: genereate the password hash
    const hash = await argon.hash(dto.password);

    try {
      // TODO: save the new user on the Database
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      delete user.hash;

      // TODO: return the saved user
      return user;
    } catch (error) {
      // if (
      //   error instanceof // ? Its not working
      //   PrismaClientKnownRequestError
      // ) {
      //   if (error.code === 'P2002') {
      //     throw new ForbiddenException(
      //       'Credentials taken',
      //     );
      //   }
      // }
      if (error.code === 'P2002') {
        throw new ForbiddenException(
          'Credentials taken',
        );
      }
      throw error;
    }
  }
  async signin(dto: AuthDto) {
    // TODO: Find the user by id
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
    // TODO: If the user does not exists throw exception
    if (!user)
      throw new ForbiddenException(
        'Incorrect credentials',
      );

    // TODO: Compare password
    const pwMatches = await argon.verify(
      user.hash,
      dto.password,
    );
    // if password is incorrect throw exception
    if (!pwMatches) throw new ForbiddenException(
      'Incorrect credentials',
    );

    // TODO: Send back the user
    delete user.hash;
    return user;
  }
}
