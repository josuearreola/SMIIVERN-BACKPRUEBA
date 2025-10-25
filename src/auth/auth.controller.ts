import { Controller, Post, Body, ValidationPipe, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ApiBody } from '@nestjs/swagger';
import { ApiConsumes } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) { }

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', format: 'password' },
        nombre: { type: 'string' },
        apellido: { type: 'string' },
        tipoUsuario: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente'
  })
  @ApiResponse({
    status: 409,
    description: 'El email ya está registrado'
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos'
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Iniciar sesión de usuario' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', format: 'password' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso'
  })
  @ApiResponse({
    status: 400,
    description: 'Credenciales inválidas'
  })
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    const payload = { sub: user.id, email: user.email, tipoUsuario: user.tipoUsuario };
    const token = this.jwtService.sign(payload);
    return {
      message: 'Login exitoso',
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        tipoUsuario: user.tipoUsuario,
      },
    };
  }
}
