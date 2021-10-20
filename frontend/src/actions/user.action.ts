import { useHistory } from "react-router";
import { useSetRecoilState } from "recoil";
import authService, { RoleList } from "../services/auth.service";
import { authAtom } from "../state/auth.state";
import { usersAtom } from "../state/users.state";


export { useUserActions }

function useUserActions () {
    const history = useHistory()
    const setAuth = useSetRecoilState(authAtom)
    const setUsers = useSetRecoilState(usersAtom)

    return {
        login,
        logout,
        // getAll,
    }

    async function login(username: string, password: string) {
        const user = await authService.login({ username, password })
        await setAuth(user?.token)

        if (user?.user.role === RoleList.Admin) {
            await history.push("/profile?")
        }
        // if Not Admin
        await history.push("/profile")
    }

    async function logout() {
        await authService.logout()
        await setAuth(null)
    }
}