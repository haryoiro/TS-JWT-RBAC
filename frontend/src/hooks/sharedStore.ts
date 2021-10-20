import SharedStoreWorker from "./sharedStorage.worker.ts?sharedworker"

export class SharedStore {
    private store: SharedWorker
    private key: string
    private response: any
    private static instance: SharedStore

    private constructor(key: string) {
        this.store = new SharedStoreWorker()
        this.key = key
        this.store.port.start()
        this.store.port.postMessage({ command: "get", key: key })
        this.store.port.onmessage = (value: MessageEvent<any>) => {
            const data = JSON.parse(value.data)
            switch (data.status) { case "get": this.response = data.value }
        }
    }

    static init(key: string) {
        if(!SharedStore.instance) {
            SharedStore.instance = new SharedStore(key)
        }
        return SharedStore.instance
    }

    get(key: string) {
        this.store.port.postMessage({ command: "get", key })
        if (this.response) {
            return this.response
        }
    }

    set(key: string, data: Record<string, any> | string | number): void {
        this.store.port.postMessage({ command: "set", key, data })
        this.store.port.postMessage({ command: "get", key })
    }
}

export default SharedStore.init