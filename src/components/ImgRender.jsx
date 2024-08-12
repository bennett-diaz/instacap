import { useImage } from '../contexts/imageContext';


const ImgRender = () => {
    const { imgBox } = useImage();

    const imageStyle = {
        maxHeight: '500px',
        maxWidth: '100%',
        width: 'auto',
        height: 'auto',
        display: 'block',
        margin: '0 auto',
        boxShadow: '0px 0px 20px rgba(38,38,38,0.10)',
        borderRadius: "4px"
    };

    return (<img src={imgBox} style={imageStyle} />);
};

export default ImgRender;