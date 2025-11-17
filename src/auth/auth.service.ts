import { Injectable, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email }, //TypeORM
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(registerDto.password, saltRounds);
    const newUser = this.userRepository.create({
      email: registerDto.email,
      passwordHash: passwordHash,
      nombre: registerDto.nombre,
      apellido: registerDto.apellido,
      tipoUsuario: registerDto.tipoUsuario,
    });
    await this.userRepository.save(newUser);
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return {
      message: 'Usuario registrado exitosamente',
      user: userWithoutPassword,
    };
  }
  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('Credenciales inválidas');
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestException('Credenciales inválidas');
    }
    return user;
  }
  async login(user: User) {
    const payload = { email: user.email, sub: user.id, tipoUsuario: user.tipoUsuario };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' }); // Access token corto
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' }); // Refresh token largo

    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(user.id, { refreshToken: hashedRefresh });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userRepository.findOne({ where: { id: payload.sub } });
      if (!user || !(await bcrypt.compare(refreshToken, user.refreshToken))) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      return this.login(user); // Devuelve nuevos tokens
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}