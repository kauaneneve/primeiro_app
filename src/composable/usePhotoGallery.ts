import { ref, onMounted, watch, resolveComponent } from 'vue';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { isPlatform } from '@ionic/vue';
import { Capacitor } from '@capacitor/core';

export interface UserPhoto {
    filePath: string;
    webviewPath?: string;
}

export function usePhotoGallery() {
    const photos = ref<UserPhoto[]>([]);
    const PHOTO_STORAGE = 'photos';

    const cachePhotos = () => {
        Preferences.set({
            key: PHOTO_STORAGE,
            value: JSON.stringify(photos.value),
        });
    };
    const convertBlobToBase64 = (blob: Blob) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        });
    const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
        let base64Data: string;
        if (isPlatform('hybrid')) {
            const file = await Filesystem.readFile({
                path: photo.path!,
            });
            base64Data = file.data;
        } else {
            const response = await fetch(photo.webPath!);
            const blob = await response.blob();
            base64Data = (await convertBlobToBase64(blob)) as string;
        }
        const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Data,
        });
        if (isPlatform('hybrid')) {
            return{
                filePath: savedFile.uri,
                webviewPath: Capacitor.convertFileSrc(savedFile.uri),
            };
        }
        else {
            return {
                filePath: fileName,
                webviewPath: photo.webPath,
            };
        }
    }
    const takePhoto = async () => {
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100,
        });

        const fileName = new Date().getTime() + '.jpeg';
        const savedFileImage = await savePicture(photo, fileName);


        photos.value = [savedFileImage, ...photos.value];
    };

    const loadSaved = async () => {
        const photolist = await Preferences.get({ key: PHOTO_STORAGE });
        const photosInPreferences = photolist.value ? JSON.parse(photolist.value) :
            [];

            if (!isPlatform('hybrid')){
        for (const photo of photosInPreferences) {
            const file = await Filesystem.readFile({
                path: photo.filePath,
                directory: Directory.Data,
            });
            photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
        }
    }
        photos.value = photosInPreferences;
    };

    onMounted(loadSaved);
    watch(photos, cachePhotos);

    return {
        photos,
        takePhoto,
    };

}
