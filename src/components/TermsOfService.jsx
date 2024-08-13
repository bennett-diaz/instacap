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
          Welcome to Instacap! These Terms of Service ("Terms") govern your use of our web application, Instacap, which provides AI-generated Instagram captions to enhance your social media posts. By accessing or using Instacap, you agree to these Terms. If you do not agree, please do not use our service.
        </Text>
      </Box>

      <Box mx="1rem" padding="1rem">
        <Text fontSize="1.25rem" fontWeight="$semibold" textAlign="left">1. Introduction</Text>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem">
          Instacap is a web app that generates witty Instagram captions using AI technology. Our goal is to make caption creation easy and fun.
        </Text>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem">
          By using Instacap, you agree to be bound by these Terms. This constitutes a binding agreement between you and Instacap.
        </Text>

        <Text fontSize="1.25rem" fontWeight="$semibold" textAlign="left">2. User Eligibility</Text>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem">
          You must be at least 13 years old to use Instacap. By using the app, you confirm that you meet this age requirement.
        </Text>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem">
          To use certain features, you may need to create an account. You agree to provide accurate information and keep your account secure.
        </Text>

        <Text fontSize="1.25rem" fontWeight="$semibold" textAlign="left">3. User Responsibilities</Text>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem">
          You retain ownership of the photos and content you upload. Instacap does not claim any ownership rights over your content.
        </Text>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem">
          You agree to use Instacap responsibly and not to engage in any activities that are harmful, offensive, or violate the rights of others.
        </Text>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem">
          You are responsible for any captions or interactions generated through your use of Instacap. Instacap is not liable for user-generated content.
        </Text>

        <Text fontSize="1.25rem" fontWeight="$semibold" textAlign="left">4. Privacy and Data Usage</Text>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem">
          Instacap collects data to enhance your experience. We collect information such as usage data and interaction details.
        </Text>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem">
          Instacap integrates with third-party services such as Firebase and the Gemini API. These services may have their own data practices, which are not covered by our privacy policy.
        </Text>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem">
          By using Instacap, you consent to our data collection and processing practices. Please review our <Link href="https://instacap.ai/privacy" isExternal="true"><LinkText>Privacy Policy</LinkText></Link> for more information.
        </Text>

        <Text fontSize="1.25rem" fontWeight="$semibold" textAlign="left">5. Intellectual Property</Text>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem">
          Instacap owns all rights, title, and interest in and to the software and features provided by the app.
        </Text>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem">
          We grant you a limited, non-exclusive, non-transferable license to use Instacap for personal, non-commercial purposes.
        </Text>

        <Text fontSize="1.25rem" fontWeight="$semibold" textAlign="left">6. Liability and Disclaimers</Text>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem">
          Instacap is not liable for any direct, indirect, incidental, or consequential damages arising from your use of the app.
        </Text>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem">
          Instacap is provided "as is" without any warranties, express or implied. We do not guarantee that the app will be error-free or uninterrupted.
        </Text>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem">
          Instacap is not responsible for any harm or damage caused by third-party services, including the Gemini API, used within the app.
        </Text>

        <Text fontSize="1.25rem" fontWeight="$semibold" textAlign="left">7. Modification and Termination</Text>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem">
          Instacap reserves the right to modify these Terms at any time. We will notify you of significant changes. Continued use of the app after changes indicates acceptance of the new Terms.
        </Text>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem">
          Instacap may suspend or terminate your account if you violate these Terms or engage in any conduct detrimental to the app or its users.
        </Text>

        <Text fontSize="1.25rem" fontWeight="$semibold" textAlign="left">8. Dispute Resolution</Text>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem">
          These Terms are governed by the laws of [Your Jurisdiction]. Any disputes will be resolved in accordance with these laws.
        </Text>
        <Text fontSize="1rem" textAlign="left" paddingVertical="0.5rem">
          Any disputes arising from these Terms will be resolved through binding arbitration, without resorting to class actions or other court proceedings.
        </Text>

        <Text fontSize="1.25rem" fontWeight="$semibold" textAlign="left">9. Contact Information</Text>
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
