import { createContext, useContext, useState } from 'react';

// TODO: may not need this if using Google File API

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {

    const [urlBox, setUrlBox] = useState('')
    const [isUrlBoxValid, setIsUrlBoxValid] = useState(false)
    const [imgUrl, setImgUrl] = useState('')
    const [imgForm, setImgForm] = useState(null)
    const [imgSrc, setImgSrc] = useState(null)
    const [imgBox, setImgBox] = useState('')
    const [imageBase64, setimageBase64] = useState(null);



    return (
        <ImageContext.Provider value={{ urlBox, setUrlBox, isUrlBoxValid, setIsUrlBoxValid, imgUrl, setImgUrl, imgForm, setImgForm, imgSrc, setImgSrc, imgBox, setImgBox, imageBase64, setimageBase64 }}>
            {children}
        </ImageContext.Provider>
    );

}


export const useImage = () => useContext(ImageContext);