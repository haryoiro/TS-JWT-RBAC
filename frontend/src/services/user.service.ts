import api from "./apiAccess"
import axios, { AxiosResponse } from "axios";
import authService from "./auth.service";

class UserService {
    async getAllUsers() {
        try {
            const headers = authService.header()
            const response: AxiosResponse<any> = await api.get("/admin/users", headers)
            console.log(response)
            return response
        } catch (e) {
            console.log("res", e)
        }
    }
}

export default new UserService
