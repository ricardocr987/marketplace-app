export async function urlToFile(
    url: string,
    filename: string,
    mimeType: string
): Promise<File> {
    if (url.startsWith('data:')) {
        var arr = url.split(','),
            mime = arr[0].match(/:(.*?);/)?.[1],
            bstr = atob(arr[arr.length - 1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        var file = new File([u8arr], filename, { type: mime || mimeType });
        return Promise.resolve(file);
    }

    const res = await fetch(url);
    const buffer = await res.arrayBuffer();

    return new File([buffer], filename, { type: mimeType });
}

export function convertBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result as string);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
}
