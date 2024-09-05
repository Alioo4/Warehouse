import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt'
import { LoginAuthDto } from './dto/login.dto';
import { RegisterAuthDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService
  ){}
  async register(payload: RegisterAuthDto) {
    const { username, password} = payload

    const hashPas = await hash(password, 12)

    const newUser = await this.prisma.user.create({data: {username, password: hashPas }})
    
    const token = await this.jwt.sign({id: newUser.id});

    return {data: token}
  }

  async login(payload: LoginAuthDto) {
    const { password, username } = payload
    
    const findUser = await this.prisma.user.findFirst({where: {username}})

    if(!findUser)
      throw new BadRequestException('User not found!!!')

    const check = await compare(password, findUser.password);

    if(!check)
      throw new UnauthorizedException()
    
    const token = await this.jwt.sign({id: findUser.id});
    return {data: token, id: findUser.id};
  }

  async update(id: string, payload: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new BadRequestException('User not found!!!');
    }

    const updateData: Partial<UpdateUserDto> = {};

    if (payload.username) {
      updateData.username = payload.username;
    }
    if (payload.password) {
      updateData.password = await hash(payload.password, 12);
    }
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    return updatedUser;
  }
}



