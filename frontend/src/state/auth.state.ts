import { useHistory } from "react-router"
import { atom, selector, useRecoilCallback, useRecoilValue, useSetRecoilState } from "recoil"
import authService, { ILoginValue, IUser, RoleList } from "../services/auth.service"

const defaultMe = {
    id: "",
    username: "",
    email: "",
    role: RoleList.User,
}

type AuthState = {
    token: string | null,
    me: IUser
}

type AuthActions = {
    useSignUp: (username: string, password: string, email: string) => Promise<boolean>,
    useLogin: () => (username: string, password: string) => void,
    useLogout: () => ()  => void
}

type AuthSelectors = {
    me: () => IUser,
    loggedIn: () => boolean
}

const authState = atom<AuthState>({
    key: "auth",
    default: {
        token: null,
        me: defaultMe
    }
})

export const authActions: AuthActions = {
    useSignUp: async (username: string, password: string, email: string) => {
        const res = await authService.SignUp({ username, password, email })
        return res?.status == 200
    },
    useLogin: () => useRecoilCallback(({ set }) => async (username: string, password: string) => {
        const user = await authService.login({ username, password })
        set(authState, () => ({
            token: user?.token || null,
            me: user?.user || defaultMe,
        }))
    }, []),
    useLogout: () => useRecoilCallback(({ set }) => async () => {
        await authService.logout()
        set(authState, () => ({
            token: null,
            me: defaultMe
        }))
    }, []),
}

const meState = selector({
    key: "me",
    get: ({ get }) => {
        return get(authState).me
    }
})

const loggedInState = selector({
    key: "loggedIn",
    get: ({ get }) => {
        return !!get(authState).token
    }
})

export const authSelectors: AuthSelectors = {
    me: () => useRecoilValue(meState),
    loggedIn: () => useRecoilValue(loggedInState)
}
