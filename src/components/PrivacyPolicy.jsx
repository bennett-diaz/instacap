import { VStack, Box, Text, Link, Heading } from '@gluestack-ui/themed';

const PrivacyPolicy = () => {
  return (
    <VStack flexGrow={1} bg="$primary50" alignItems="center" padding="1rem">
      <Box mx="1rem">
        <Heading fontSize="1.2rem" textAlign="center" paddingTop="1rem" paddingBottom="0.5rem">
          Privacy Policy
        </Heading>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem" paddingHorizontal="1rem" sx={{ "@md": { fontSize: '1.25rem' } }}>
          This Privacy Policy outlines how we collect, use, and safeguard your data when you use our web application. By accessing or using Instacap, you agree to this Privacy Policy. If you do not agree, please refrain from using our service.
        </Text>
      </Box>

      <Box mx="1rem" padding="1rem">
        <Heading fontSize="1rem" bold={false} textAlign="left">
          1. Privacy Approach
        </Heading>
        <Text textAlign="left" paddingVertical="0.5rem">
          Instacap is designed with a privacy-first approach. We do not store your personal image data. Images are processed into a binary format at runtime and sent to third-party APIs, but they are not stored at rest. Please refer to the Google privacy policy for information on how third-party APIs, such as those provided by Google, may collect or store this data for training purposes.
        </Text>

        <Heading fontSize="1rem" bold={false} textAlign="left">
          2. User Eligibility
        </Heading>
        <Text textAlign="left" paddingVertical="0.5rem">
          Instacap is not intended for users under the age of 19. By using our service, you confirm that you meet this age requirement.
        </Text>

        <Heading fontSize="1rem" bold={false} textAlign="left">
          3. Personal Information Collection
        </Heading>
        <Text textAlign="left" paddingVertical="0.5rem">
          We do not collect personally identifiable information (PII) such as your name. However, we may collect your phone number if you choose to set up an account. You have the option to delete your account at any time, which will remove your phone number from our records.
        </Text>

        <Heading fontSize="1rem" bold={false} textAlign="left">
          4. Third-Party Services
        </Heading>
        <Text textAlign="left" paddingVertical="0.5rem">
          Instacap integrates with the following third-party services:
        </Text>
        <Text textAlign="left" paddingVertical="0.5rem">
          - <strong>Gemini API:</strong> Used for AI-powered caption generation.
        </Text>
        <Text textAlign="left" paddingVertical="0.5rem">
          - <strong>Firebase:</strong> Used for backend services, including Authentication and Firestore.
        </Text>
        <Text textAlign="left" paddingVertical="0.5rem">
          These services may have their own data practices. Please refer to their privacy policies for more information.
        </Text>

        <Heading fontSize="1rem" bold={false} textAlign="left">
          5. Data Security
        </Heading>
        <Text textAlign="left" paddingVertical="0.5rem">
          We take reasonable measures to ensure the security of your personal information. However, please be aware that no method of electronic transmission or storage is completely secure. While we strive to protect your data, we cannot guarantee its absolute security.
        </Text>

        <Heading fontSize="1rem" bold={false} textAlign="left">
          6. Data Retention
        </Heading>
        <Text textAlign="left" paddingVertical="0.5rem">
          Our data retention policies are governed by the default settings of Firebase services, including Authentication and Firestore. Data is retained only as long as necessary to provide you with the service and comply with legal obligations.
        </Text>

        <Heading fontSize="1rem" bold={false} textAlign="left">
          7. Policy Changes
        </Heading>
        <Text textAlign="left" paddingVertical="0.5rem">
          We may update this Privacy Policy from time to time. Any changes will be posted on this page, and we encourage you to review the policy periodically to stay informed about how we protect your information.
        </Text>

        <Heading fontSize="1rem" bold={false} textAlign="left">
          8. Contact Information
        </Heading>
        <Text textAlign="left" paddingVertical="0.5rem" paddingBottom="1rem">
          If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at{' '}
          <Link href="mailto:team@instacap.ai">
            <Text color="$primary500">team@instacap.ai</Text>
          </Link>
          .
        </Text>
      </Box>
    </VStack>
  );
};

export default PrivacyPolicy;
