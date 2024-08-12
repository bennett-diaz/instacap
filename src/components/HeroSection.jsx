import { Box } from '@gluestack-ui/themed';

const HeroSection = () => {
    const mobile640 = "/images/hero-mobile-640-stacked.jpg";
    const mobile768 = "/images/hero-mobile-768-stacked.jpg";
    const mobile1024 = "/images/hero-mobile-1024-stacked.jpg";
    const mobile1366 = "/images/hero-mobile-1366-stacked.jpg";
    const mobile1440 = "/images/hero-mobile-1440-stacked.jpg";
    const mobile1600 = "/images/hero-mobile-1600-stacked.jpg";
    const mobile1920 = "/images/hero-mobile-1920-stacked.jpg";
    const web1600 = "/images/hero-web-1600-3d.jpg";
    const web1920 = "/images/hero-web-1920-3d.jpg";
    const a = "/images/640.jpg";
    const b = "/images/768.jpg";
    const c = "/images/1024.jpg";
    const d = "/images/1366.jpg";
    const e = "/images/1600.jpg";
    const f = "/images/1920.jpg";

    const imgStyle = {
        maxWidth: '100%',
        width: 'auto',
        height: 'auto',
    };

    const boxStyle = {
        display: 'flex',
        justifyContent: "center",
        maxHeight: '70vh',
    };

    return (
        // <Box display='flex' justifyContent="center" alignItems="center" bg='$primary50'>
        <Box style={boxStyle} bg='$primary50'>
            <img
                src={mobile1024} // Fallback for browsers that don't support srcset
                srcSet={`${mobile640} 640w, ${mobile768} 768w, ${mobile1024} 1024w, ${mobile1366} 1366w, ${mobile1440} 1440w, ${mobile1600} 1600w, ${mobile1920} 1920w`} // Updated srcSet with 1440
                sizes="(min-width: 1920px) 1920px, 
                       (min-width: 1600px) 1600px, 
                       (min-width: 1440px) 1440px, 
                       (min-width: 1366px) 1366px, 
                       (min-width: 1024px) 1024px, 
                       (min-width: 768px) 768px, 
                       100vw"
                style={imgStyle}
                alt="hero banner"
                loading="lazy"
            />
        </Box>
    );
}

export default HeroSection;
