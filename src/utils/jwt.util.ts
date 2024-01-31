import jwtDecode from 'jwt-decode';
import {GJwtPayload} from '../models/common/gJwtPayload.interface';

const parseJwt = (jwt: string): GJwtPayload => jwtDecode<GJwtPayload>(jwt);
const isTokenExpired = (decodedJwt: GJwtPayload): boolean =>
  !decodedJwt.exp || decodedJwt.exp < new Date().getTime() / 1000;

export default {parseJwt, isTokenExpired};
