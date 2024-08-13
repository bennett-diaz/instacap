import { VStack, Box, Text, Link, LinkText } from '@gluestack-ui/themed';

const TermsOfService = () => {
  return (
    <VStack flexGrow={1} bg="$primary50" alignItems="center" padding="1rem">
      <Box mx="1rem">
        <Text fontSize="2rem" fontWeight="$semibold" lineHeight="1.2" textAlign="center" paddingTop="1rem" paddingBottom="0.5rem"
          sx={{
            "@md": {
              fontSize: '2rem',
              lineHeight: '22px',
              paddingBottom: '1rem',
            }
          }}>
          Terms of Service
        </Text>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem" paddingHorizontal="1rem" sx={{ "@md": { fontSize: '1.25rem' } }}>
          Welcome to Instacap! These Terms of Service ("Terms") govern your use of our web application, Instacap, which provides AI-generated Instagram captions. By accessing or using Instacap, you agree to these Terms.
        </Text>
      </Box>

      <Box mx="1rem" padding="1rem">
        <Text fontSize="1.25rem" fontWeight="$semibold" textAlign="left">1. User Eligibility</Text>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem">
          You must be at least 13 years old to use Instacap. By using the app, you confirm that you meet this age requirement.
        </Text>

        <Text fontSize="1.25rem" fontWeight="$semibold" textAlign="left">2. User Responsibilities</Text>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem">
          You retain ownership of the photos and content you upload. Instacap is not liable for user-generated content.
        </Text>

        <Text fontSize="1.25rem" fontWeight="$semibold" textAlign="left">3. Privacy and Data Usage</Text>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem">
          Instacap collects data to enhance your experience. We integrate with third-party services such as Firebase and the Gemini API.
        </Text>

        <Text fontSize="1.25rem" fontWeight="$semibold" textAlign="left">4. Intellectual Property</Text>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem">
          Instacap owns all rights to the software. We grant you a limited, non-exclusive, non-transferable license to use Instacap.
        </Text>

        <Text fontSize="1.25rem" fontWeight="$semibold" textAlign="left">5. Liability and Disclaimers</Text>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem">
          Instacap is provided "as is" without warranties. We are not responsible for any harm caused by third-party services, including the Gemini API.
        </Text>

        <Text fontSize="1.25rem" fontWeight="$semibold" textAlign="left">6. Contact Information</Text>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem">
          For support and inquiries, please contact us at <Link href="mailto:support@instacap.ai"><LinkText>support@instacap.ai</LinkText></Link>.
        </Text>
      </Box>

      <Text fontSize="0.85rem" color="$textLight500" textAlign="center" paddingHorizontal="1.5rem" paddingVertical="1rem">
        We do not store your photos or personal data. By using this product you agree to our{' '}
        <Link href="https://instacap.ai/privacy" isExternal="true">
          <LinkText fontSize="0.85rem" color="$textLight500">privacy policy</LinkText>
        </Link>.
      </Text>
    </VStack>
  );
};

export default TermsOfService;
