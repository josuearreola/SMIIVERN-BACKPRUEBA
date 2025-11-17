import {
  Controller,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    try {
      const users = await this.usersService.findAll();
      return {
        success: true,
        data: users,
        message: 'Usuarios obtenidos exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener usuarios',
        error: error.message,
      };
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.usersService.findById(id);
      return {
        success: true,
        data: user,
        message: 'Usuario obtenido exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener usuario',
        error: error.message,
      };
    }
  }

  @Patch(':id/toggle-status')
  @HttpCode(HttpStatus.OK)
  async toggleActiveStatus(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.usersService.toggleActiveStatus(id);
      return {
        success: true,
        data: result.user,
        message: result.message,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al cambiar estado del usuario',
        error: error.message,
      };
    }
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { activo: boolean },
  ) {
    try {
      const result = await this.usersService.updateUserStatus(id, body.activo);
      return {
        success: true,
        data: result.user,
        message: result.message,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al actualizar estado del usuario',
        error: error.message,
      };
    }
  }

  @Patch(':id/user-type')
  @HttpCode(HttpStatus.OK)
  async updateUserType(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { tipoUsuario: string },
  ) {
    try {
      const result = await this.usersService.updateUserType(id, body.tipoUsuario as any);
      return {
        success: true,
        data: result.user,
        message: result.message,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al actualizar tipo de usuario',
        error: error.message,
      };
    }
  }

  @Patch(':id/profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { nombre: string; apellido: string; email: string },
  ) {
    try {
      const result = await this.usersService.updateProfile(id, body);
      return {
        success: true,
        data: result.user,
        message: result.message,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al actualizar perfil',
        error: error.message,
      };
    }
  }

  @Patch(':id/change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    try {
      const result = await this.usersService.changePassword(
        id,
        body.currentPassword,
        body.newPassword,
      );
      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al cambiar contraseña',
        error: error.message,
      };
    }
  }
}