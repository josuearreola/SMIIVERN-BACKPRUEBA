import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async register(registerDto: RegisterDto) {
    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(registerDto.password, saltRounds);

    // Crear el usuario
    const newUser = this.userRepository.create({
      email: registerDto.email,
      passwordHash: passwordHash,
      nombre: registerDto.nombre,
      apellido: registerDto.apellido,
      tipoUsuario: registerDto.tipoUsuario,
    });

    // Guardar en la base de datos
    await this.userRepository.save(newUser);

    // Retornar sin la contraseña
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
}