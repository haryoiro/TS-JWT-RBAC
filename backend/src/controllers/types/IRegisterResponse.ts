import { RoleList } from './../../../../frontend/src/services/auth.service';
import { User } from '../../entity/User';
import { IResponse } from './IResponse';
import { IJwtPayload } from 'entity/types/jwt';

export interface IRegisterResponse extends IResponse {
    locals: {
        data?
        token: {
            accessToken: string;
            refreshToken: string;
            expiresIn: number;
        }
        user: {
            id: string;
            username: string;
            email: string;
            role: RoleList;
        },
        jwt?: IJwtPayload,
    }
}