import { createContext, useContext, useState, useEffect } from 'react';
import { Home, Hash, Sparkles } from 'lucide-react';
import { User, UserRound, CircleUser, CircleUserRound, UserCheck, UserRoundCheck, UserX, UserRoundX } from 'lucide-react';
import { Library, LibraryBig, LibrarySquare, Book, MoreHorizontal, PanelRightIcon, LayoutGrid, LayoutDashboard, LayoutPanelLeft, Grid2X2, Grip } from 'lucide-react';
import { isPwa, isMobileResolution } from '../utils/genericUtils';

export const LayoutContext = createContext();
export const AppContext = createContext('null'); // fallback if there is no provider above it in the tree   


export const LayoutContextProvider = ({ children }) => {

    const [isMobile, setIsMobile] = useState(isMobileResolution());
    const [isWeb, setIsWeb] = useState(!(isMobile));
    const [isDevicePwa, setIsDevicePwa] = useState(false);
    const [devMode, setDevMode] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobileStatus = isMobileResolution();
            setIsMobile(mobileStatus);
            setIsWeb(!mobileStatus);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);




    // useEffect(() => {
    //   if (Platform.OS === "web") {
    //     document.body.style.overflow = "hidden";
    //     document.body.style.height = "100%";
    //   }
    // }, []);


    const TabColorMapping = {
        Home: "$primary500",
        Account: "$indigo500",
        More: "$pink500"
    };

    const TabColorMappingv2 = {
        Home: "$primary500",
        Account: "$pink500",
        More: "$indigo500"
    };

    const IconMapping = {
        Home: Home,
        Hash: Hash,
        Sparkles: Sparkles,
        User: User,
        UserRound: UserRound,
        CircleUser: CircleUser,
        CircleUserRound: CircleUserRound,
        UserCheck: UserCheck,
        UserRoundCheck: UserRoundCheck,
        UserX: UserX,
        UserRoundX: UserRoundX,
        Library: Library,
        LibraryBig: LibraryBig,
        LibrarySquare: LibrarySquare,
        Book: Book,
        MoreHorizontal: MoreHorizontal,
        PanelRightIcon: PanelRightIcon,
        LayoutGrid: LayoutGrid,
        LayoutDashboard: LayoutDashboard,
        LayoutPanelLeft: LayoutPanelLeft,
        Grid2X2: Grid2X2,
        Grip: Grip
    };

    return (
        <LayoutContext.Provider value={{ devMode, setDevMode, isMobile, setIsMobile, isWeb, setIsWeb, isDevicePwa, TabColorMapping, TabColorMappingv2, IconMapping }}>
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayout = () => useContext(LayoutContext);
