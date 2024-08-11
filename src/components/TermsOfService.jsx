import React, { useEffect } from 'react';
import { Box, Text } from '@gluestack-ui/themed';


const TermsOfService = () => {

    useEffect(() => {
        document.title = "Terms of Service";
        // If user navigates back to main app
        return () => {
          document.title = "Instacap";
        };
      }, []);

    return (
        <Box >
            <Text> This is a placeholder for ToS </Text>
        </Box>
    );
}


export default TermsOfService;