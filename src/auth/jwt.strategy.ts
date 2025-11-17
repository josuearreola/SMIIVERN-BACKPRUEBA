import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae token de header Authorization
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'tu_secreto_jwt', // Usa el mismo secret
    });
  }

  async validate(payload: any) {
    // Payload del token: { sub: user.id, email, tipoUsuario }
    return { userId: payload.sub, email: payload.email, tipoUsuario: payload.tipoUsuario };
  }
}