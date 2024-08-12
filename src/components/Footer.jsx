import { React, useState } from 'react';
import { Box, HStack, Button, ButtonText, ButtonIcon, Text, Link, LinkText } from '@gluestack-ui/themed';
// import { Smartphone, Bookmark } from 'lucide-react';


const Footer = () => {
    return (
        <Box
            display='none'
            paddingHorizontal="$1rem"
            paddingVertical="$1rem"
            borderTopWidth='$1'
            borderColor='$borderLight300'
            alignItems='center'
            justifyContent='space-between'
            position="relative"
            left="0"
            right="0"
            bottom="0"
            bg="$backgroundLight0"
            flexDirection='row'
            sx={{
                "@md": {
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }
            }}
        >


            <HStack display='flex' alignItems='center' justifyContent='center'
                sx={{
                    "@md": {
                        display: 'flex',
                        justifyContent: 'center'

                    }
                }}
            >
                <Box >
                    <Text paddingTop="0" fontSize="0.85rem" color="$textLight700">2024 Step Function LLC</Text>

                    <HStack>
                        <a href="https://bennett-diaz.github.io/step-function/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }} >
                            <Text fontSize="0.85rem" color="$textLight700">Terms of Use</Text>
                        </a>
                        <Text paddingTop="0" fontSize="0.85rem">  ·  </Text>

                        {/* <Link href="https://bennett-diaz.github.io/step-function/" isExternal="true" >
                        <Text fontSize="0.85rem" color="$textLight700" textDecorationLine='none'>Privacy</Text>
                    </Link>
                    <Text paddingTop="0" fontSize="0.85rem"> | </Text> */}
                        <a href="mailto:team@instacap.ai" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }} >
                            <Text fontSize="0.85rem" color="$textLight700">Contact Us</Text>
                        </a>
                    </HStack>

                </Box>
            </HStack>


            <Button display='none'
                bg="$backgroundLight200" padding="0.5rem"
                sx={{
                    height: '100%',
                    flexDirection: 'row',
                    width: '110px',
                    justifyContent: 'center',
                }}
            >
                {/* <ButtonIcon as={Bookmark} color="$textLight700" paddingHorizontal="0.25rem" size="24px" /> */}
                <ButtonText lineHeight='1.2' textAlign='center' fontSize="0.85rem" color="$textLight700" >Save app to home screen</ButtonText>

            </Button>




        </Box >

    );
}

export default Footer;