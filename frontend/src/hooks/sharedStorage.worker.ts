const _worker: SharedWorkerGlobalScope = self as any;
const store = new Map();

export default _worker.onconnect = (e) => {
    const port = e.ports[0];
    console.log(store)
    port.onmessage = async (event) => {
        try {
            switch (event.data.command) {
                case "set":
                    port.postMessage(JSON.stringify(event.data));
                    store.set(event.data.key, JSON.stringify(event.data.data));
                    break;
                case "get":
                    const value = store.get(event.data.key);
                    port.postMessage(JSON.stringify({ status: "get", value }));
                    break;
            }
        }
        catch (e) {
            port.postMessage(e);
        }
    };
    port.start();
};
