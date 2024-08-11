const breakpoints = {
    sm: 480,
    md: 768,
    lg: 992,
    xl: 1280,
};


export const isPwa = () => {
    return (window.matchMedia('(display-mode: standalone)').matches) ||
        (window.navigator.standalone) ||
        document.referrer.includes('android-app://');
}

export const isMobileResolution = () => {
    return window.innerWidth < breakpoints.md; 
};