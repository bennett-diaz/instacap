
import { useImage } from '../contexts/imageContext';
import { HStack, VStack, Box, Fab, FabIcon, FabLabel } from '@gluestack-ui/themed';
import { RotateCcw } from 'lucide-react';



const RestartFab = () => {
    const { imgSrc } = useImage();

    const restartStyle = {
        // background: "linear-gradient(90deg, rgba(67,56,202,1) 0%, rgba(109,40,217,1) 22%, rgba(236,72,153,1) 92%)",
        // padding: "1rem",
    };

    // make position dynamic to scroll

    const onFab = () => {
        console.log('fab pressed')
    };

    return (
        imgSrc && <Fab
            style={restartStyle}
            // borderWidth= "$2"
            // borderColor= "$borderLight0"
            // size="lg"
            placement="top right"
            // isHovered={true}
            // isDisabled={false}
            // isPressed={false}
            sx={{
                "@md": {
                    display: 'flex',
                }
            }}
            onPress={onFab}
        >

            <FabIcon as={RotateCcw} on />
            {/* <FabLabel fontWeight='$medium'>New image</FabLabel> */}
        </Fab>
    );
}


export default RestartFab;
