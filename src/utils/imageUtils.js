

export const isUrlValid = (url) => {
    try {
        new URL(url);
        return true;

    } catch (error) {
        return false;
    }
};

export const isImgFileValid = (file) => {
    const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/PNG', 'image/gif', 'image/bmp', 'image/svg+xml'];
    const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB

    if (!file || file.size === 0) {
        return { isValid: false, reason: 'No file selected or file is empty.' };
    }

    if (!acceptedImageTypes.includes(file.type)) {
        return { isValid: false, reason: 'Please upload a .jpeg or .png.' };
    }

    if (file.size > maxSizeInBytes) {
        return { isValid: false, reason: `Your image exceeds the limit of ${maxSizeInBytes / 1024 / 1024} MB.` };
    }

    return { isValid: true, reason: null };
};

export const reduceImage = (file) => {
    return new Promise((resolve, reject) => {

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const newWidth = 300;
                const scaleFactor = newWidth / img.width;
                const newHeight = img.height * scaleFactor;

                canvas.width = newWidth;
                canvas.height = newHeight;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/jpeg', 0.7);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export const formDataHasImage = (formData) => {
    return formData && formData.has('image') && formData.get('image');
};
