import React, { useEffect } from 'react';
import { Box, Text } from '@gluestack-ui/themed';


const Privacy = () => {

    useEffect(() => {
        document.title = "Privacy Policy";
        // If user navigates back to main app
        return () => {
          document.title = "Instacap";
        };
      }, []);
      
    return (
        <Box >
            <Text> This is a placeholder for Privacy </Text>
        </Box>
    );
}


export default Privacy;