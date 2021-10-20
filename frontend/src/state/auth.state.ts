import { atom } from "recoil"

const authAtom = atom({
    key: "auth",
    default: sessionStorage.getItem("token")
})

export { authAtom }