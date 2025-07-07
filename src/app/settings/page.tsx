'use client';

import { useSettings } from '@/context/SettingsContext';
import { Box, Typography, Switch, Button, Paper, Divider } from '@mui/material';
import { useState } from 'react';

const tosContent = (
  <Box>
    <Typography variant="h5" gutterBottom>
      BoxBoxd Terms of Service
    </Typography>
    <Typography variant="body2" color="text.secondary" gutterBottom>
      Last updated: July 7, 2025
    </Typography>
    <Divider sx={{ my: 2 }} />
    <Typography variant="subtitle1" gutterBottom>1. Acceptance of Terms</Typography>
    <Typography variant="body2" paragraph>
      By creating an account or using BoxBoxd (“Service”), you agree to these Terms of Service (“Terms”). If you do not agree, do not use the Service.
    </Typography>
    <Typography variant="subtitle1" gutterBottom>2. Eligibility</Typography>
    <Typography variant="body2" paragraph>
      You must be at least 13 years old to use BoxBoxd. By using the Service, you confirm you meet this requirement.
    </Typography>
    <Typography variant="subtitle1" gutterBottom>3. Account Registration</Typography>
    <Typography variant="body2" paragraph>
      • You must provide accurate and complete information when creating your account.<br />
      • You are responsible for maintaining the confidentiality of your login credentials.<br />
      • You are responsible for all activity under your account.
    </Typography>
    <Typography variant="subtitle1" gutterBottom>4. User Content</Typography>
    <Typography variant="body2" paragraph>
      • You retain ownership of content you post (e.g., reviews, profile info).<br />
      • By posting content, you grant BoxBoxd a non-exclusive, worldwide, royalty-free license to display and distribute your content within the Service.<br />
      • You must not post content that is illegal, offensive, or violates the rights of others.
    </Typography>
    <Typography variant="subtitle1" gutterBottom>5. Acceptable Use</Typography>
    <Typography variant="body2" paragraph>
      You agree not to:<br />
      • Use the Service for unlawful purposes.<br />
      • Attempt to disrupt or compromise the Service’s security or integrity.<br />
      • Impersonate others or misrepresent your affiliation.
    </Typography>
    <Typography variant="subtitle1" gutterBottom>6. Termination</Typography>
    <Typography variant="body2" paragraph>
      We reserve the right to suspend or terminate your account at our discretion, including for violations of these Terms.
    </Typography>
    <Typography variant="subtitle1" gutterBottom>7. Disclaimers</Typography>
    <Typography variant="body2" paragraph>
      • The Service is provided “as is” without warranties of any kind.<br />
      • We are not responsible for the accuracy or reliability of user content.
    </Typography>
    <Typography variant="subtitle1" gutterBottom>8. Limitation of Liability</Typography>
    <Typography variant="body2" paragraph>
      To the maximum extent permitted by law, BoxBoxd is not liable for any indirect, incidental, or consequential damages arising from your use of the Service.
    </Typography>
    <Typography variant="subtitle1" gutterBottom>9. Changes to Terms</Typography>
    <Typography variant="body2" paragraph>
      We may update these Terms from time to time. Changes will be posted on this page with a new effective date. Continued use of the Service constitutes acceptance of the new Terms.
    </Typography>
    <Typography variant="subtitle1" gutterBottom>10. Contact</Typography>
    <Typography variant="body2" paragraph>
      For questions about these Terms, contact us at:<br />
      <a href="mailto:support@boxboxd.com" style={{ color: 'inherit', textDecoration: 'underline' }}>support@boxboxd.com</a>
    </Typography>
  </Box>
);

const privacyContent = (
  <Box>
    <Typography variant="h5" gutterBottom>
      BoxBoxd Privacy Policy
    </Typography>
    <Typography variant="body2" color="text.secondary" gutterBottom>
      Last updated: July 7, 2025
    </Typography>
    <Divider sx={{ my: 2 }} />
    <Typography variant="subtitle1" gutterBottom>1. Introduction</Typography>
    <Typography variant="body2" paragraph>
      BoxBoxd (“we”, “us”, or “our”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use the BoxBoxd platform (“Service”).
    </Typography>
    <Typography variant="subtitle1" gutterBottom>2. Information We Collect</Typography>
    <Typography variant="body2" paragraph>
      • Account Information: Username, email address, password (hashed), and avatar.<br />
      • Profile Data: Favorite F1 team, reviews, and other profile details you provide.<br />
      • Usage Data: Pages visited, features used, and interactions within the Service.<br />
      • Device & Log Data: IP address, browser type, device information, and access times.<br />
      • Cookies: We may use cookies and similar technologies for authentication and analytics.
    </Typography>
    <Typography variant="subtitle1" gutterBottom>3. How We Use Your Information</Typography>
    <Typography variant="body2" paragraph>
      • To provide and maintain the Service.<br />
      • To personalize your experience (e.g., theming, recommendations).<br />
      • To communicate with you about updates or support requests.<br />
      • To monitor and improve the Service, including analytics and security.<br />
      • To enforce our Terms of Service and comply with legal obligations.
    </Typography>
    <Typography variant="subtitle1" gutterBottom>4. Information Sharing</Typography>
    <Typography variant="body2" paragraph>
      We do <b>not</b> sell your personal information. We may share information:<br />
      • With service providers who help us operate the Service (e.g., hosting, analytics).<br />
      • If required by law, regulation, or legal process.<br />
      • To protect the rights, property, or safety of BoxBoxd, our users, or others.
    </Typography>
    <Typography variant="subtitle1" gutterBottom>5. Data Security</Typography>
    <Typography variant="body2" paragraph>
      We use industry-standard security measures to protect your data. However, no method of transmission or storage is 100% secure. You are responsible for keeping your password confidential.
    </Typography>
    <Typography variant="subtitle1" gutterBottom>6. Data Retention</Typography>
    <Typography variant="body2" paragraph>
      We retain your information as long as your account is active or as needed to provide the Service. You may request deletion of your account and data at any time by contacting us.
    </Typography>
    <Typography variant="subtitle1" gutterBottom>7. Children’s Privacy</Typography>
    <Typography variant="body2" paragraph>
      BoxBoxd is not intended for users under 13. We do not knowingly collect personal information from children under 13.
    </Typography>
    <Typography variant="subtitle1" gutterBottom>8. Your Rights</Typography>
    <Typography variant="body2" paragraph>
      Depending on your location, you may have rights to access, correct, or delete your personal data. Contact us at <a href="mailto:privacy@boxboxd.com" style={{ color: 'inherit', textDecoration: 'underline' }}>privacy@boxboxd.com</a> for requests.
    </Typography>
    <Typography variant="subtitle1" gutterBottom>9. Changes to This Policy</Typography>
    <Typography variant="body2" paragraph>
      We may update this Privacy Policy from time to time. Changes will be posted on this page with a new effective date.
    </Typography>
    <Typography variant="subtitle1" gutterBottom>10. Contact</Typography>
    <Typography variant="body2" paragraph>
      For questions or concerns about this Privacy Policy, contact us at:<br />
      <a href="mailto:privacy@boxboxd.com" style={{ color: 'inherit', textDecoration: 'underline' }}>privacy@boxboxd.com</a>
    </Typography>
  </Box>
);

const SettingsPage = () => {
  const { mode, toggleMode } = useSettings();
  const [tosOpen, setTosOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 5, p: 2 }}>
      <Typography variant="h4" mb={2}>Settings</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1">Appearance</Typography>
        <Box display="flex" alignItems="center" mt={1}>
          <Switch checked={mode === 'dark'} onChange={toggleMode} />
          <Typography ml={1}>{mode === 'dark' ? 'Dark Mode' : 'Light Mode'}</Typography>
        </Box>
      </Paper>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1">Legal</Typography>
        <Button variant="outlined" sx={{ mt: 1, mr: 2 }} onClick={() => setTosOpen(true)}>
          View Terms of Service
        </Button>
        <Button variant="outlined" sx={{ mt: 1 }} onClick={() => setPrivacyOpen(true)}>
          View Privacy Policy
        </Button>
      </Paper>
      {/* Modal dialogs for TOS/Privacy Policy */}
      {tosOpen && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', bgcolor: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper sx={{ p: 3, maxWidth: 700, maxHeight: '90vh', overflowY: 'auto' }}>
            {tosContent}
            <Button sx={{ mt: 3 }} onClick={() => setTosOpen(false)}>Close</Button>
          </Paper>
        </Box>
      )}
      {privacyOpen && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', bgcolor: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper sx={{ p: 3, maxWidth: 700, maxHeight: '90vh', overflowY: 'auto' }}>
            {privacyContent}
            <Button sx={{ mt: 3 }} onClick={() => setPrivacyOpen(false)}>Close</Button>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default SettingsPage;
