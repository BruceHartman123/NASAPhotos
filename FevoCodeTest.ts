import PhotoInterface from './PhotoInterface'
import PhotoCache from './NasaPhotoCache'
import axios from 'axios'

const cameraName = 'NAVCAM'
const apiKey = 'DEMO_KEY'
const baseUrl = 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos'

export default class FevoCodeTest {
    photoCache: PhotoCache = new PhotoCache()

    /**
     * This initialilizes the cache and gets the last ten days of photos. 
     */
     async nasaPhotoApi(): Promise<void> {
        // The cache needs to be initialized every time. It doesn't erase the cache.
        await this.photoCache.initialize()
        const photoResponse = await this.getLastTenDaysFromNasa(new Date())
        console.log("NASA Photo API")
        console.log(photoResponse)
    }

    /**
     * This gets the last ten days of photos from NASA, limiting the number of photos per day to three.
     * This will also cache the photos and retrieve them from the cache.
     * @returns The last ten days of photos from NASA
     */
    async getLastTenDaysFromNasa(day: Date): Promise<PhotoInterface> {
        const photos: PhotoInterface = {}
        const nasaPhotoCache = await this.photoCache.getPhotoCache();

        // Get the last 10 days of photos.
        for (let i = 0; i < 11; i++) {
            // This treats local time as GMT, and generates a string that will match NASA's day key.
            let dayKey = day.toISOString().split('T')[0]

            // If the photos exist in the cache, get them from there.
            if (nasaPhotoCache[dayKey]) {
                photos[dayKey] = nasaPhotoCache[dayKey]
            }
            else {
                try {
                    // The photos did not exist in the cache. Get them from NASA.
                    let photoData: any = 
                        await axios.get(`${baseUrl}?earth_date=${dayKey}&camera=${cameraName}&api_key=${apiKey}`,
                        {
                            headers: {
                                'Accept-Encoding': 'application/json',
                            }
                        })

                    // If there are more than three photos for the day, slice them down to three and extract the
                    // information from the response to fit our API.
                    if (photoData?.data?.photos) {
                        const imageArray = photoData.data.photos.slice(0, 3)
                        photos[dayKey] = imageArray.map((ia: { img_src: string }) => ia.img_src)
                    }
                    else {
                        console.error("Invalid Photo data from Nasa")
                    }
                }
                catch(e: unknown) {
                    // The most common error will be the 429 api request limit error.
                    console.error('Error retrieving photos from NASA:')
                    if (e instanceof Error) {
                        console.error(e.message)
                    }
                    else {
                        console.error(e)
                    }
                }
            }

            // Set the day to the previous day.
            day.setDate(day.getDate() - 1)
        }

        // Set the cache to the latest data. This is a little primitive, but it does have the added bonus
        // of deleting any data older than 10 days from the cache.
        await this.photoCache.setPhotoCache(photos)

        return photos
    }
}

const codeTest = new FevoCodeTest()
codeTest.nasaPhotoApi()