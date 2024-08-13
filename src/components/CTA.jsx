import { useState, useRef, useEffect } from 'react';
import { isImgFileValid, isUrlValid, reduceImage } from '../utils/imageUtils';
import { HStack, VStack, Box, Text, Link, LinkText, Button, ButtonText, ButtonIcon, Spinner, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, Input, InputField, AlertCircleIcon, set } from '@gluestack-ui/themed';
import { Sparkles } from 'lucide-react'
import { useImage } from '../contexts/imageContext';
import { useResults } from '../contexts/resultsContext';
import { getFunctions, httpsCallable } from 'firebase/functions';



const CTA = () => {
    const { workflow, setWorkflow, workflowStages } = useResults();

    const { urlBox, setUrlBox, isUrlBoxValid, setIsUrlBoxValid, setImgUrl, setImgForm, setImgSrc, imgBin, setImgBin } = useImage()

    const [fileError, setFileError] = useState(false);
    const [fileErrorMsg, setFileErrorMsg] = useState('');
    const fileInputRef = useRef(null);


    const upButtonId = "imgUpload"
    const genButtonId = "urlGenerate"
    const [buttonLoading, setButtonLoading] = useState({});
    const [buttonDisabled, setButtonDisabled] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (workflow === workflowStages.IDLE) {
            setButtonLoading({
                [upButtonId]: false,
                [genButtonId]: false
            })
            setButtonDisabled({
                [upButtonId]: false,
            })
        } else if (workflow === (workflowStages.SUMMARIZING || workflowStages.CAPTIONING) || workflowStages.IMGRENDER) {
            setButtonDisabled({
                [upButtonId]: true,
                [genButtonId]: true
            })
        }
    }, [workflow])



    const isButtonLoading = (buttonId) => {
        return buttonLoading[buttonId] || false;
    }

    const onUrlUpload = (event) => {
        if (urlBox && isUrlBoxValid) {

            setWorkflow(workflowStages.SUMMARIZING);
            setImgUrl(urlBox);
            setImgForm(null);
            setImgSrc(null);
            setButtonLoading({
                ...buttonLoading,
                [genButtonId]: true
            })
        } else {
            console.log('url was not valid; nothing triggered')
        }
    }

    const reduceFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const elem = document.createElement('canvas');
                    const scaleFactor = 0.5; // Adjust this to control image size
                    elem.width = img.width * scaleFactor;
                    elem.height = img.height * scaleFactor;
                    const ctx = elem.getContext('2d');
                    ctx.drawImage(img, 0, 0, elem.width, elem.height);
                    ctx.canvas.toBlob(
                        (blob) => {
                            resolve(blob);
                        },
                        'image/jpeg',
                        0.8 
                    );
                };
                img.onerror = reject;
            };
            reader.onerror = reject;
        });
    };

    const onFileUpload = async (event) => {
        const file = event.target.files[0];
        setFileError(false);
        setFileErrorMsg('');
        setImgUrl('');
        if (file) {
            const validationResult = isImgFileValid(file);
            if (validationResult.isValid) {
                try {
                    const reducedImageBlob = await reduceImage(file);
                    const formData = new FormData();
                    formData.append('image', reducedImageBlob, file.name);
                    setImgForm(formData);
    
                    const blobUrl = URL.createObjectURL(file);
                    setImgSrc(blobUrl);
    
                    setWorkflow(workflowStages.SUMMARIZING);
                    setUrlBox('');
                    setImgUrl('');
                    setButtonLoading({ ...buttonLoading, [upButtonId]: true });
    
                    // Use a Promise to read the file
                    const reducedFileBlob = await reduceFile(file);

                    const imageBase64 = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            const base64 = reader.result.split(',')[1];
                            console.log('Base64 length:', base64.length);
                            resolve(base64);
                        };
                        reader.readAsDataURL(reducedFileBlob);
                    });
            
                    console.log('About to call uploadFile');
                    const functions = getFunctions();
                    // const uploadFile = httpsCallable(functions, 'uploadFile');
                    // const res = await uploadFile({ imageBase64 });
                    const getVertex = httpsCallable(functions, 'getVertex');
                    const res = await getVertex({ imageBase64 });
    
                    // Handle the response here (e.g., set state with the captions)
    
                } catch (error) {
                    console.error('Error in image processing:', error);
                    setFileError(true);
                    setFileErrorMsg('Error processing image.');
                }
            } else {
                setFileError(true);
                setFileErrorMsg(validationResult.reason);
                console.log('File validation failed:', validationResult.reason);
            }
            event.target.value = '';
        }
    };


    const handleUploadPress = (event) => {
        fileInputRef.current.click();
    };

    const onUrlChange = event => {
        setUrlBox(event.target.value);

        if (isUrlValid(event.target.value)) {
            setIsUrlBoxValid(true);
        } else {
            setIsUrlBoxValid(false);
        }
    };


    return <VStack flexGrow={1} bg="$primary50" alignItems='center' gap="0rem" >
        <Box mx="1rem">
            <Text fontSize="2rem" fontWeight='$semibold' lineHeight="1.2" textAlign="center" paddingTop="1rem" paddingBottom="0.5rem"
                sx={{
                    "@md": {
                        fontSize: '2rem',
                        lineHeight: '22px',
                        paddingBottom: '1rem',


                    }
                }}>
                Free caption generator
            </Text>

            <Text fontSize="1rem" textAlign="center" paddingVertical="0.5rem" paddingHorizontal="1rem"
                sx={{ "@md": { fontSize: '1.25rem' } }}>
                Use the power of AI to create witty captions for your next social media post
            </Text>
        </Box>

        <HStack display='none' width="100%" gap="1rem" paddingHorizontal="1rem" paddingVertical="1rem"
            sx={{
                "@md": { display: 'flex' }
            }}>
            <FormControl flexGrow={1} isInvalid={!isUrlBoxValid && urlBox.length > 0} isDisabled={false} isRequired={false} >
                <Input height="100%" bg="$white">
                    <InputField type="text" value={urlBox} onChange={onUrlChange} placeholder="Image url" />
                </Input>
                <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>
                        Please enter a valid image Url.
                    </FormControlErrorText>
                </FormControlError>
            </FormControl>
            <Button id={genButtonId} flexShrink={0} onPress={onUrlUpload} action={"primary"} variant={"solid"} isDisabled={!isUrlBoxValid || buttonDisabled[genButtonId]} isFocusVisible={false}>
                <ButtonText>Generate</ButtonText>
                {isButtonLoading(genButtonId) ?
                    <Spinner color="$textLight0" ml="0.5rem" />
                    :
                    <ButtonIcon as={Sparkles} ml="0.5rem" size="18px" />
                }
            </Button>
        </HStack>

        <VStack width="100%" justifyContent='center' alignItems='center' paddingTop="0.5rem" paddingBottom="0.5rem" paddingHorizontal="1rem">
            <FormControl isInvalid={fileError} alignItems='center' >
                <Button id={upButtonId} flexShrink={0} onPress={handleUploadPress} isDisabled={buttonDisabled[upButtonId]}>
                    <ButtonText>Upload your image</ButtonText>
                    {isButtonLoading(upButtonId) ?
                        <Spinner color="$textLight0" ml="0.5rem" />
                        :
                        <ButtonIcon as={Sparkles} ml="0.5rem" size="18px" />
                    }
                    <ButtonText> </ButtonText>

                </Button>

                <input type="file" accept="image/*" onChange={onFileUpload} style={{ display: 'none' }} ref={fileInputRef} />
                <FormControlError bottom="-20px" left="0" padding="0.5rem">
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText  >{fileErrorMsg}</FormControlErrorText>
                </FormControlError>

            </FormControl>

        </VStack>

        <Text fontSize="0.85rem" color='$textLight500' thin textAlign="center" paddingHorizontal="1.5rem" paddingVertical="1rem">
            We do not store your photos or personal data. By using this product you agree to our{' '}
            <Link href="https://instacap.ai/privacy" isExternal="true" >
                <LinkText fontSize="0.85rem" color="$textLight500" >privacy policy</LinkText>
            </Link>
            .
        </Text>

    </VStack>;
};
export default CTA;