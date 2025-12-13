/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User } from "../users/entities/user.entity";

type SafeUser = Omit<User, "password">;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<SafeUser | null> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password: _password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: SafeUser) {
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
    };
    const token = this.jwtService.sign(payload);
    // Return both token and user for the client to store
    return {
      access_token: token,
      user,
    };
  }
}
