import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, TipoUsuario } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        tipoUsuario: true,
        activo: true,
        fechaCreacion: true,
        fechaActualizacion: true,
        // Excluir passwordHash y refreshToken por seguridad
      },
      order: {
        fechaCreacion: 'DESC',
      },
    });

    return users;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        tipoUsuario: true,
        activo: true,
        fechaCreacion: true,
        fechaActualizacion: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async toggleActiveStatus(
    id: number,
  ): Promise<{ message: string; user: User }> {
    const user = await this.findById(id);

    // Cambiar el estado activo
    const updatedUser = await this.userRepository.save({
      ...user,
      activo: !user.activo,
    });

    const action = updatedUser.activo ? 'habilitado' : 'deshabilitado';

    return {
      message: `Usuario ${action} exitosamente`,
      user: updatedUser,
    };
  }

  async updateUserStatus(
    id: number,
    activo: boolean,
  ): Promise<{ message: string; user: User }> {
    const user = await this.findById(id);

    const updatedUser = await this.userRepository.save({
      ...user,
      activo,
    });

    const action = activo ? 'habilitado' : 'deshabilitado';

    return {
      message: `Usuario ${action} exitosamente`,
      user: updatedUser,
    };
  }

  async updateUserType(
    id: number,
    tipoUsuario: TipoUsuario,
  ): Promise<{ message: string; user: User }> {
    const user = await this.findById(id);

    const updatedUser = await this.userRepository.save({
      ...user,
      tipoUsuario,
    });

    return {
      message: `Tipo de usuario actualizado a ${tipoUsuario} exitosamente`,
      user: updatedUser,
    };
  }

  async updateProfile(
    id: number,
    profileData: { nombre: string; apellido: string; email: string },
  ): Promise<{ message: string; user: User }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Verificar si el email ya está en uso por otro usuario
    if (profileData.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: profileData.email },
      });
      if (existingUser) {
        throw new BadRequestException(
          'El email ya está en uso por otro usuario',
        );
      }
    }

    // Actualizar perfil
    await this.userRepository.save({
      ...user,
      ...profileData,
    });

    return {
      message: 'Perfil actualizado exitosamente',
      user: await this.findById(id), // Devolver sin campos sensibles
    };
  }

  async changePassword(
    id: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    // Buscar usuario con password para verificar
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'passwordHash'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    // Hashear nueva contraseña
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar contraseña
    await this.userRepository.save({
      ...user,
      passwordHash: hashedNewPassword,
    });

    return {
      message: 'Contraseña cambiada exitosamente',
    };
  }
}
