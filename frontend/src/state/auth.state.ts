import { useHistory } from "react-router"
import { atom, selector, useRecoilCallback, useRecoilValue, useSetRecoilState } from "recoil"
import authService, { ILoginValue, IUser, RoleList } from "../services/auth.service"

const defaultMe = {
    id: "",
    username: "",
    email: "",
    role: RoleList.User,
}

/** --------
 * Atoms
 --------- */

type AuthState = {
    token?: string | null,
    me: { user: IUser }
}

const authState = atom<AuthState>({
    key: "auth",
    default: {
        token: sessionStorage.getItem("token"),
        me: JSON.parse(localStorage.getItem("user") || "")
    }
})

/** --------
 * Actions
 --------- */

type AuthActions = {
    init: () => () => void
    useSignUp: (username: string, password: string, email: string) => Promise<boolean>,
    useLogin: () => (username: string, password: string) => void,
    useLogout: () => () => void
}

export const authActions: AuthActions = {
    init: () => useRecoilCallback(({ set }) => () =>{
        const user =JSON.parse(localStorage.getItem("user") || "")
        if (user) {
            set(authState, (state) => {
                return {
                    ...state,
                    ...user,
                }
            })
        }
    }, []),
    useSignUp: async (username: string, password: string, email: string) => {
        const res = await authService.signup({ username, password, email })
        return res?.status == 200
    },
    useLogin: () => useRecoilCallback(({ set }) => async (username: string, password: string) => {
        const user = await authService.login({ username, password })
        localStorage.setItem("user", JSON.stringify(user))
        if (user) {
            set(authState, () => ({
                token: user.token,
                me: { user: user.user },
            }))
            console.log("ok", user)
        }
    }, []),
    useLogout: () => useRecoilCallback(({ set }) => async () => {
        await authService.logout()
        localStorage.clear()
        set(authState, () => ({
            token: null,
            me: { user: defaultMe }
        }))
    }, []),
}

/** --------
 * Selectors
 --------- */

type AuthSelectors = {
    me: () => {user: IUser | undefined},
    loggedIn: () => boolean
}

const meState = selector({
    key: "me",
    get: ({ get }) => {
        let me = get(authState)
        if (!me) {
            me = JSON.parse(localStorage.getItem("user") || "")
        }
        return me.me
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