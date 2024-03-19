import { type DocHandle, isValidAutomergeUrl, Repo } from '@automerge/automerge-repo'
import { BroadcastChannelNetworkAdapter } from '@automerge/automerge-repo-network-broadcastchannel'
import { IndexedDBStorageAdapter } from '@automerge/automerge-repo-storage-indexeddb'
import { next as A, type Doc } from '@automerge/automerge'
import { derived, get, writable } from 'svelte/store'
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket"


const repo = new Repo({
  network: [
		new BroadcastChannelNetworkAdapter(),
		new BrowserWebSocketClientAdapter('wss://sync.automerge.org')
	],
  storage: new IndexedDBStorageAdapter()
})

const rootDocUrl = `${document.location.hash.substring(1)}`
export const handle = writable<DocHandle<{ counter?: A.Counter }>>()

if (isValidAutomergeUrl(rootDocUrl)) {
  handle.set(repo.find(rootDocUrl))
} else {
  handle.set(repo.create<{ counter?: A.Counter }>())
  get(handle).change((d) => (d.counter = new A.Counter()))
}

export const docUrl = derived(handle, ($handle) => (document.location.hash = $handle.url))
export const doc = writable<{
	counter?: A.Counter | undefined;
}>()
handle.subscribe(h=> {
	h.addListener('change', ()=>updateDoc(h.docSync()))
})
function updateDoc(handle: Doc<{
	counter?: A.Counter | undefined;
}> | undefined) {
	if (!handle) return

	doc.set(handle)
}
// @ts-expect-error we'll use this later for experimentation
window.handle = get(handle)
