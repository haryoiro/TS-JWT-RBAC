import { JwtPayload } from 'jsonwebtoken';
import { Action } from "routing-controllers";
import { AuthService } from "../service/Auth.service"

export const authorizationChecker = async (action: Action, roles: number[]) => {
    const token = action.request.headers["authorization"].split(' ')[1];
    const payload = await AuthService.verifyAccessToken(token) as JwtPayload

    if (payload.user && !roles.length) return true
    if (payload.user && (Math.min(...roles) >= payload.user.role)) return true

    return false
}