import { useEffect, useState } from 'react'
//@ts-ignore
import SharedStoreWorker from "./sharedStorage.worker.ts?sharedworker"

/**
 * return [ set, get ]
 */
type TSharedStoreFunctions<T> = [
    () =>  T | undefined,
    (data: Record<string, any> | string | number) => void,
]

export default function useSharedStore<T>(key: string):  TSharedStoreFunctions<T>{
    const store = new SharedStoreWorker()
    const [res, setRes] = useState<T>()

    const loadStore = () => {
        store.port.start()
        store.port.postMessage({ command: "get", key })
    }
    const updateStore = () => store.port.postMessage({ command: "get", key })

    useEffect(() => {
        window.addEventListener("load", loadStore, false)
        window.addEventListener("focus", updateStore, false)
        window.addEventListener("blur", updateStore, false)

        store.port.onmessage = (value: MessageEvent<any>) => {
            const data = JSON.parse(value.data)
            switch (data.status) {
                case "get": setRes(data.value)
            }
        }
        return () => {
            window.removeEventListener("focus", loadStore)
            window.removeEventListener("load", updateStore)
            window.removeEventListener("blur", updateStore)
        }
    })

    const set = (data: Record<string, any> | string | number) => {
        store.port.postMessage({ command: "set", key, data })
    }
    const get = (): T | undefined => {
        store.port.postMessage({ command: "get", key })
        if (res) {
            return res
        }
    }

    return [get, set]
}
