import { useHistory } from "react-router";
import { useSetRecoilState } from "recoil";
import authService, { RoleList } from "../services/auth.service";
import userService from "../services/user.service";
import { authAtom } from "../state/auth.state";
import { usersAtom } from "../state/users.state";


export { useUserActions }

function useUserActions () {
    const setUsers = useSetRecoilState(usersAtom)

    async function login(username: string, password: string) {
        const users = await userService.getAllUsers()
        setUsers(users)
    }

}