import {JwtPayload} from 'jwt-decode';

export interface GJwtPayload extends JwtPayload {
  userId?: string;
  exp?: any;
  loginType?: any;
  user?: any;
}
