import React from 'react';
import {Dimensions, StyleSheet, View, Text, ScrollView} from 'react-native';
import {FontSizeEnum, FontWeightEnum} from 'resources/fonts/fontStyles';
import R from 'resources/R';
import GModal from '../wrapper/GModal';
interface WebViewModalProps {
  isVisible: boolean;
  onModalHide: (isVisible: boolean) => void;
}
const TermsConditionModal = ({isVisible, onModalHide}: WebViewModalProps) => {
  return (
    <GModal isVisible={isVisible} onModalHide={() => onModalHide(false)}>
      <View style={styles.modalContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.headingMain}>Terms of Service</Text>
          <Text style={styles.paragraph}>
            Thank you for your interest in Magnabox private limited (“3Sigma”,
            “we” or “us”). By registering an account or accessing any 3Sigma
            services (“Services”) available via 3Sigma websites and/or mobile
            application (“App”), you agree to all the terms and conditions
            (“Terms”), together with any amendments, of this Terms of Service
            Agreement (“Agreement”). If you are using the Service on behalf of a
            company or other entity (“Company”), then you are agreeing to all
            these Terms on behalf of that Company, and you represent and warrant
            that you have the authority to bind the Company to this Agreement.
            In that case, “you” and “your” refers to you and that Company.
          </Text>
          <Text style={styles.heading}>Subscription and Pricing</Text>
          <Text style={styles.paragraph}>
            When you register an account, you will receive a trial period of 7
            days (unless otherwise stated) free of charge for which no credit
            card details nor payment will be required. Your free trial account
            will expire automatically unless you choose to opt-in to a
            subscription plan. There is no need to cancel it if you do not wish
            to continue using 3Sigma after your free trial ends.
          </Text>
          <Text style={styles.paragraph}>
            Should you choose to subscribe, the Subscription Fee will only be
            charged at the end of the free trial period and shall be charged via
            credit card in full and in the currency specified for the
            Subscription Plan selected (unless otherwise arranged on a
            case-by-case basis at our sole discretion). Your Subscription Fee
            will remain fixed during your Subscription Term and includes access
            to all existing features. When you pay by credit card, you authorize
            us to charge your credit card or bank account for all fees payable
            during the Subscription Term. You further authorize us to use a
            third party to process payments, and consent to the disclosure of
            your payment information to such third party.
          </Text>
          <Text style={styles.paragraph}>
            Your subscription will be automatically renewed at the amount and
            frequency as specified in your selected Subscription Plan (e.g.
            monthly, yearly, or another period), until cancelled. You may cancel
            your 3Sigma subscription at any time without penalty, after which
            you will no longer be billed. If you cancel your subscription, you
            may continue to use your subscription until the end of your
            then-current Subscription Term.
          </Text>
          <Text style={styles.heading}>Data and Privacy</Text>
          <Text style={styles.paragraph}>
            In order to register an account, you must submit contact information
            such as your name, email address, and phone number as it is used to
            verify, secure, and access your account. To keep you logged in, we
            use cookies on the site and similar tokens in the app. Our server
            software may also store basic technical information, such as your IP
            address, in memory or logs.
          </Text>
          <Text style={styles.paragraph}>
            Through 3Sigma Services, you will have the option to import and
            create leads. This leads data, along with the aforementioned data
            and contact information submitted by or for you to the 3Sigma
            Services, including electronic data and information submitted by or
            for you through your use of third-party applications, or collected
            and processed automatically by or for you using the 3Sigma Services
            is herein referred to as “Your Data”.
          </Text>
          <Text style={styles.paragraph}>
            Your Data may be used to deliver, maintain and improve our services,
            including for troubleshooting, data analytics, testing, research,
            statistical and survey purposes. We may also use Your Data to
            contact and provide you with Services that you request, develop new
            Services, suggest personally relevant features, and to keep our
            services, business, and users safe and secure.
          </Text>
          <Text style={styles.paragraph}>
            Where required by law, we may disclose Your Data in response to
            subpoenas, court orders, or other legal requirements; to exercise
            our legal rights or defend against legal claims; to investigate,
            prevent, or take action regarding illegal activities, suspected
            fraud or abuse, violations of our policies; or to protect our rights
            and property. We will carefully review all requests to ensure that
            they are legally valid and are limited to the data that law
            enforcement agencies require for their specific legal purposes.
          </Text>
          <Text style={styles.paragraph}>
            For any reason or no reason at all, you may terminate this Agreement
            at any time by sending us an email at support@3Sigma.com to delete
            Your Data and Service account. Deleted information may be kept in
            backups for up to 90 days. Backups are encrypted and are only
            accessed if needed for disaster recovery.
          </Text>
          <Text style={styles.heading}>Data and Privacy</Text>
          <Text style={styles.paragraph}>
            We implement a variety of security measures to help keep Your Data
            secure. Your Data is fully encrypted in transit (TLS 1.2 via HTTPS)
            and in the database (256-bit Advanced Encryption Standard). We’re
            committed to using the highest grade technology to secure and
            protect Your Data.
          </Text>
          <Text style={styles.heading}>Account Security</Text>
          <Text style={styles.paragraph}>
            3Sigma offers a secure login process with one-time passwords (“OTP”)
            via email or SMS. You are solely responsible for controlling who has
            access to your account by limiting access to your computers and
            devices, and with whom you share your OTP code(s) with for multiple
            device logins.
          </Text>
          <Text style={styles.heading}>Third-Party Services</Text>
          <Text style={styles.paragraph}>
            The Services include features and/or functionality that interoperate
            with online services operated by third-parties (“Third-Party
            Services”), pursuant to agreements between 3Sigma and the operators
            of such Third-Party Services (such agreements, “Third-Party
            Agreements” and such operators, “Operators”) or through application
            programming interfaces or other means of interoperability made
            generally available by the Operators (“Third-Party APIs”) which
            3Sigma does not control. Third-Party Agreements and Third-Party APIs
            (and the policies, terms and rules applicable to Third-Party APIs)
            may be modified, suspended or terminated at any time. 3Sigma shall
            have no liability with respect to any such modification, suspension
            or termination. You are responsible for ensuring that your use of
            the Services in connection with any Third-Party Service complies
            with all agreements, policies, terms and rules applicable to such
            Third-Party Service. Subject to payment of any fees owed to the
            Company, you are granted a non-transferable and non-exclusive
            license for the term of this Agreement to download, run and use the
            Software and Services on your device for your internal business
            operations. Disassembly, decompilation or reverse engineering and
            other source code derivation of the software comprised within the
            Software or Services is prohibited, as far as this is prohibited by
            law.
          </Text>
          <Text style={styles.paragraph}>
            Unless otherwise specified in this Agreement, the Software and
            Services are provided and may be used by you in conjunction with its
            existing systems and applications to facilitate your authorized
            users use of the Software and Services. You may not: (i) lease,
            loan, resell or otherwise distribute the Software or Services save
            as permitted in writing by the Company; (ii) use the Software or
            Services to provide ancillary services related to the Software or
            Services; or (iii) except as permitted in this Agreement, provide
            access to or allow the use of the Software Services by or on behalf
            of any third party.
          </Text>
          <Text style={styles.paragraph}>
            You must not (or assist others to) access, use, copy, adapt, modify,
            prepare derivative works based upon, distribute, license,
            sublicense, transfer, display, perform, or otherwise exploit our
            Services in impermissible or unauthorized manners, or in ways that
            burden, impair, or harm us, our Services, systems, our users, or
            others, including that you must not directly or through automated
            means: (a) reverse engineer, alter, modify, create derivative works
            from, decompile, or extract code from our Services; (b) send, store,
            or transmit viruses or other harmful computer code through or onto
            our Services; (c) gain or attempt to gain unauthorized access to our
            Services or systems; (d) interfere with or disrupt the integrity or
            performance of our Services; (e) create accounts for our Services
            through unauthorized or automated means; (f) collect the information
            of or about our users in any impermissible or unauthorized manner;
            (g) sell, resell, rent, or charge for our Services; or (h)
            distribute or make our Services available over a network where they
            could be used by multiple devices at the same time.
          </Text>
          <Text style={styles.heading}>Keeping Your Account Secure.</Text>
          <Text style={styles.paragraph}>
            You are responsible for keeping your device and your WhatsApp
            account safe and secure, and you must notify us promptly of any
            unauthorized use or security breach of your account or our Services.
          </Text>
          <Text style={styles.heading}>PERMITTED USE</Text>
          <Text style={styles.paragraph}>
            When using the Software or Services, you and authorized users agree
            to comply with all applicable laws and third-party IPRs. (“IPR)
            means all copyrights, patents, utility models, trademarks, service
            marks, registered designs, moral rights, design rights (whether
            registered or unregistered), technical information, know-how,
            database rights, semi-conductor topography rights, business names
            and logos, computer data, generic rights, proprietary information
            rights and all other similar proprietary rights (and all
            applications and rights to apply for registration or protection of
            any of the foregoing) as may exist anywhere in the world. You
            further agree not to post, display, perform or otherwise distribute
            proprietary information which breaches the IPRs of third parties, or
            which is confidential, defamatory, or inappropriate content. You are
            solely responsible for any breach of any applicable law relating to
            the rights of third parties caused by Customer Data provided or
            transmitted by You or through your device. The burden to show that
            the Customer Data provided by you does not breach any law or any the
            rights of third parties are exclusively borne by you. You agree that
            all logos symbolizing the Company, and all content, designs, and
            photos posted on the Software’s website by the Company and any and
            all authorized users and third-parties, are exclusively owned by the
            Company unless otherwise indicated. In no event shall the Software
            or Services be used: (i) to attack, abuse, threaten, defame or
            otherwise breach the rights of the Company or any other party; (ii)
            for illegal, fraudulent or deceptive activities or practices; (iii)
            to transmit proprietary information of authorized users or a third
            party; (iv) to attempt to introduce viruses or other malicious code;
            (v) to attempt to obtain unauthorized access to the computer network
            or user accounts of the Company; (vi) to encourage criminal
            behavior; or (vii) to breach any terms of this Agreement. The
            Company reserves the right, in its sole discretion, to terminate
            this Agreement and/or block access to use of the Services or
            Software for any reason, including, without limitation, a complaint
            received by the Company concerning a breach of this Agreement by you
            or an authorized user, or of the IPRs of a third party.
          </Text>
          <Text style={styles.heading}>INTELLECTUAL PROPERTY</Text>
          <Text style={styles.paragraph}>
            All contents of the Service are copyrighted © 2016 LeadsBridge. All
            rights reserved. All IPRs and title to the Software and Services
            (save to the extent they incorporate any Customer Data or third
            party owned item) shall remain with the Company and/or its licensors
            and no interest or ownership in the Services, Software, Company IPRs
            or otherwise is transferred to you under this Agreement. No right to
            modify, adapt, or translate the Software or Services or create
            derivative works from the Software or Services is granted to you.
            Nothing in this Agreement shall be construed to mean, by inference
            or otherwise, that you have any right to obtain source code for the
            software comprised within the Software or Services. Company content
            may not be sold, reproduced, or distributed without our written
            permission. Any third-party trademarks, service marks, and logos are
            the property of their respective owners. Any further rights not
            specifically granted herein are reserved.
          </Text>
          <Text style={styles.paragraph}>
            You shall retain sole ownership of all rights, title, and interest
            in and to Customer Data and shall have the sole responsibility for
            the legality, reliability, integrity, accuracy, and quality of the
            Customer Data.
          </Text>
          <Text style={styles.paragraph}>
            You warrant and represent that you shall maintain reasonable
            security measures (as may change over time) covering, without
            limitation, confidentiality, authenticity, and integrity to ensure
            that access to the Software and Services granted under this
            Agreement is limited as set out in this Agreement. The Company may
            take and maintain technical precautions to protect the Software and
            Services from improper or unauthorized use, distribution or copying.
          </Text>
          <Text style={styles.heading}>WARRANTIES</Text>
          <Text style={styles.paragraph}>
            Except as expressly stated in this Agreement, all warranties and
            conditions, whether express or implied by statute, common law or
            otherwise (including but not limited to satisfactory quality and
            fitness for purpose), are hereby excluded to the fullest extent
            permitted by law. No warranty is made regarding the results of usage
            of the Software or Services or that the functionality of the
            Software or Services will meet your requirements or that the
            Software or Services will operate uninterrupted or error-free. You
            agree that the Company may occasionally remove the Software and
            Services for indefinite periods of time or cancel the software or
            Services at any time, without notice. You understand and agree that
            your use of the Software and Services is entirely at your own risk
            and that the Services and Software are provided “As Is” and “As
            Available”.
          </Text>
          <Text style={styles.paragraph}>
            You warrant and represent that: (i) you have full corporate power
            and authority to enter into this Agreement and to perform your
            obligations; (ii) the execution and performance of your obligations
            under this Agreement does not violate or conflict with the terms of
            any other agreement to which you are a party and is in accordance
            with any applicable laws; (iii) you shall respect all applicable
            laws and regulations, governmental orders and court orders, which
            relate to this Agreement; and (iv) you rightfully own the necessary
            user rights, copyrights and ancillary copyrights and permits
            required for you to fulfill your obligations under this Agreement.
          </Text>
          <Text style={styles.heading}>EXTERNAL CONTENT</Text>
          <Text style={styles.paragraph}>
            The Software or Services may include hyperlinks to third-party
            content, third-party merchant services, advertising or websites. You
            acknowledge and agree that the Software or Services are not
            responsible for and do not endorse any advertising, products or
            resource available from such resources or websites.
          </Text>
          <Text style={styles.heading}>FORCE MAJEURE</Text>
          <Text style={styles.paragraph}>
            If a party is wholly or partially prevented by Force Majeure from
            complying with its obligations under this Agreement, that party’s
            obligation to perform in accordance with the terms of this Agreement
            will be suspended. (“Force Majeure”) means anything outside the
            reasonable control of a party, including but not limited to, acts of
            God, fire, storm, flood, earthquake, explosion, accident, acts of
            the public enemy, war, rebellion, insurrection, sabotage, epidemic,
            quarantine restriction, labour dispute, labour shortage, power
            shortage, including without limitation where Company ceases to be
            entitled to access the Internet for whatever reason, server crashes,
            deletion, corruption, loss or removal of data, transportation
            embargo, failure or delay in transportation, any act or omission
            (including laws, regulations, disapprovals or failures to approve)
            of any government or government agency.
          </Text>
          <Text style={styles.heading}>No Unlawful or Prohibited Uses</Text>
          <Text style={styles.paragraph}>
            As a condition of your use of the Service, you will not use the
            Service for any purpose that is unlawful or prohibited by this
            Agreement. You may not use the Service in any manner that in our
            sole discretion could damage, disable, overburden, impair or
            interfere with any other party’s use of it. You may not obtain or
            attempt to obtain any materials or information through any means not
            intentionally made available through the Service. In addition, you
            agree not to use false or misleading information in connection with
            your account, and acknowledge that we reserve the right to disable
            any account with a profile which we believe (in our sole discretion)
            is false or misleading (including a profile that impersonates a
            third party).
          </Text>
          <Text style={styles.heading}>
            Modification and Termination of Services
          </Text>
          <Text style={styles.paragraph}>
            3Sigma reserves the right to modify, update or discontinue our
            Services, or any features or portions thereof, without prior notice.
            You agree that we can suspend or terminate your right to access our
            Services at any time without notice, obligation or liability to you
            should you be found in violation of the Terms. You may also
            terminate this Agreement at any time, for any reason or for no
            reason, by deleting your account through the Service and/or sending
            us an email at support@3Sigma.com to delete Your Data.
          </Text>
          <Text style={styles.heading}>Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            To the fullest extent allowed by applicable law, you agree to
            indemnify and hold 3Sigma and its affiliates, employees and partners
            harmless from and against any and all claims, liabilities, damages
            (actual and consequential), losses and expenses (including
            attorneys’ fees) resulting from or in any way related to any third
            party claims relating to (a) your use or misuse of the Services
            (including any actions taken by a third party using your account);
            (b) errors in the content or interruptions in the Services; (c)
            personal injury or property damage, of any nature whatsoever,
            resulting from your access to and use of the Services; (d) any
            unauthorized access to or use of our servers and/or any and all
            personal information and/or financial information stored therein. In
            the event of such a claim, suit, or action (“Claim”), we will
            attempt to provide notice of the Claim to the contact information we
            have for your account (provided that failure to deliver such notice
            shall not eliminate or reduce your indemnification obligations
            hereunder).
          </Text>
          <Text style={styles.heading}>Arbitration Agreement</Text>
          <Text style={styles.paragraph}>
            Any dispute arising out of or in connection with this contract,
            including any question regarding its existence, validity or
            termination, shall be referred to and finally resolved by
            arbitration in New Delhi in accordance with the Arbitration Rules of
            the New Delhi International Arbitration Centre for the time being in
            force, which rules are deemed to be incorporated by reference in
            this clause. The Tribunal shall consist of one arbitrator, and the
            language of the arbitration shall be in English.
          </Text>
          <Text style={styles.heading}>Applicable Law and Jurisdiction</Text>
          <Text style={styles.paragraph}>
            This Agreement shall be governed by the laws of New Delhi without
            regard to its conflict of laws provisions.
          </Text>
          <Text style={styles.paragraph}>
            Your Data may be processed, stored, and used outside of the country
            in which you are located. Data privacy laws vary across
            jurisdictions, and different laws may be applicable to Your Data
            depending on where it is processed, stored, or used.
          </Text>
        </ScrollView>
      </View>
    </GModal>
  );
};
export default TermsConditionModal;
const styles = StyleSheet.create({
  modalContainer: {
    minHeight: '100%',
    maxHeight: '80%',
    backgroundColor: R.colors.bgCol,
    padding: 20,
  },
  container: {
    justifyContent: 'center',
    height: Dimensions.get('screen').height,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingtext: {
    textAlign: 'center',
  },
  heading: {
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.SEMI_BOLD),
    marginBottom: 10,
  },
  headingMain: {
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.XL, FontWeightEnum.SEMI_BOLD),
    marginBottom: 10,
  },
  paragraph: {
    color: R.colors.themeCol1,
    ...R.generateFontStyle(FontSizeEnum.BASE, FontWeightEnum.REGULAR),
    marginBottom: 20,
  },
});
