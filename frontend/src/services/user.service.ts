import api from "./apiAccess"
import axios, { AxiosResponse } from "axios";
import authService, { genHeader } from "./auth.service";

export interface User {
    username: string;
    email: string;
    verified: boolean;
    role: number;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}

interface UsersResult {
    users: User[];
}

export interface UsersResponse {
    all_page: number;
    current_page: number;
    next_page: number;
    prev_page: boolean;
    limit: number;
    sorted_by: string;
    fields: string[];
    result: UsersResult;
}

class UserService {
    async getAll() {
        try {
            const response: AxiosResponse<User[]> = await api.get("/user", { ...genHeader() })
            return response.data
        } catch (e) {
            console.log("res", e)
        }
    }
}

export default new UserService
