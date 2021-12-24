import { atom, selector, useRecoilCallback, useRecoilValue } from "recoil"
import userService, { User } from "../services/user.service"



export enum SORT_ORDER {
    ASC = "asc",
    DESC = "desc",
}

export enum USER_FIELD {
    USERNAME = "username",
    EMAIL = "email",
    ROLE = "role",
    ISACTIVE = "isActive",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
    ID = "id",
}

const usersColumnsVisibliityDefault = (() => {
    // const column: { [key in USER_FIELD]: boolean }
    //     = Object.assign({}, ...Object.values(USER_FIELD).map(field => ({ [field]: true })))
    const column: [USER_FIELD, boolean][] = Object.entries(USER_FIELD).map(([_, value]) => [value, true])
    return column
})

const usersColumnsSortDefault = (() => {
    // const column: { [key in USER_FIELD]: { field: USER_FIELD, order: SORT_ORDER } }
    //     = Object.assign({}, ...Object.values(USER_FIELD).map(field => ({ [field]: { field, order: SORT_ORDER.ASC } })))
    const column: [USER_FIELD, SORT_ORDER][] = Object.values(USER_FIELD).map(field => [field, SORT_ORDER.ASC])
    return column
})

/** --------
 * Atoms
 --------- */

type UsersState = {
    users: User[] | null
}

type SortState = {
    active: USER_FIELD
    fields: [USER_FIELD, SORT_ORDER][]
}

const usersState = atom<UsersState>({
    key: "users",
    default: { users: [] }
})

const sortState = atom<SortState>({
    key: "sort",
    default: {
        active: USER_FIELD.UPDATED_AT,
        fields: usersColumnsSortDefault(),
    }
})

const usersColumnsVisibliity = atom({
    key: "usersColumnsVisibliity",
    default: {
        ...usersColumnsVisibliityDefault
    }
})

/** --------
 * Actions
 --------- */

type UsersActions = {
    initUsers: () => () => void,
    setSortField: () => (field: USER_FIELD) => void,
    changeColumnVisibility: () => (field: USER_FIELD, visible: boolean) => void,
    changePage: () => (page: number) => void,
}

export const usersActions: UsersActions = {
    initUsers: () => useRecoilCallback(({ set }) => async () => {
        const users = await userService.getAll()
        set(usersState, () => ({ users: users || null }))
    }, []),
    setSortField: () => useRecoilCallback(({ snapshot, set }) => (currField: USER_FIELD) => {
        const sort: { active: USER_FIELD,fields: [USER_FIELD, SORT_ORDER][] }= snapshot.getLoadable(sortState).contents
        const fields: [USER_FIELD, SORT_ORDER][] = sort.fields.map(([field, order]) => {
            if (currField === field) {
                return [field, order === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC]
            }
            return [field, order]
        })
        set(sortState, () => ({
            active: currField,
            fields
        }))
    }, []),
    changeColumnVisibility: () => useRecoilCallback(({ set }) => async (field: USER_FIELD, visible: boolean) => {
        set(usersColumnsVisibliity, () => ({
            ...usersColumnsVisibliity,
            [field]: visible,
        }))
    }, []),
    changePage: function (): (page: number) => void {
        throw new Error("Function not implemented.")
    }
}

/** --------
 * Selectors
 --------- */

type UsersSelectors = {
    all: () => User[] | null,
    //      getUserById,
    //      filterdUsers,
}

const all = selector({
    key: "all",
    get: ({ get }) => {
        const users = get(usersState).users
        const sort = get(sortState)
        const sorted = users?.slice().sort((a, b) => {
            if (a[sort.active].toString().toUpperCase() < b[sort.active].toString().toUpperCase()) {
                return sort.fields.find(([field]) => field === sort.active)?.[1] === SORT_ORDER.ASC ? -1 : 1
            }
            if (a[sort.active].toString().toUpperCase() > b[sort.active].toString().toUpperCase()) {
                return sort.fields.find(([field]) => field === sort.active)?.[1] === SORT_ORDER.ASC ? 1 : -1
            }
            return 0
        })
        return sorted || null
    }
})
// getUserById (get user by id)

// filterUsers (get filtered users)
// sortUsers (get sort users)

// Selectors
export const usersSelectors: UsersSelectors = {
     all: () => useRecoilValue(all),
    //  getUserById,
    //  filterdUsers,
}


