import api from "./apiAccess"
import axios, { AxiosResponse } from "axios";
import authService, { genHeader } from "./auth.service";

class UserService {
    async getAllUsers(skip:number=0, take:number=10) {
        try {
            const response: AxiosResponse<any> = await api
                .get("/admin/users", {
                    ...genHeader(),
                    params: {
                        skip,
                        take,
                    }
                })
            console.log(response)
            return response
        } catch (e) {
            console.log("res", e)
        }
    }
}

export default new UserService
