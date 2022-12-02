import storage from 'node-persist'
import PhotoInterface from './PhotoInterface'

export default class NasaPhotoCache {
    /**
     * The Cache must be initialized before it can be used.
     */
    async initialize(): Promise<void> {
        await storage.init()
    }

    /**
     * The the contents of the NASA Photo Cache
     * @returns The contents of the NASA Photo Cache
     */
    async getPhotoCache(): Promise<PhotoInterface> {
        const photoCache = await storage.getItem('nasaphotocache')
        if (photoCache) {
            return await JSON.parse(photoCache)
        }

        return {}
    }

    /**
     * Write the contents of the NASA Photo Cache
     * @param pcache The NASA Photo Cache
     */
    async setPhotoCache(pcache: PhotoInterface): Promise<void> {
        await storage.setItem('nasaphotocache', JSON.stringify(pcache))
    }
}
