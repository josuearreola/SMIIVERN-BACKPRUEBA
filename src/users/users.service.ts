import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
