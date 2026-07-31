'use client';

import { createContext, startTransition, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'ta';

type TranslationKey =
  | 'home' | 'whyDonate' | 'donateNow' | 'contact' | 'dashboard' | 'signIn'
  | 'signUp' | 'signedInAs' | 'profile' | 'adminDashboard' | 'signOut'
  | 'admin' | 'overview' | 'howItWorks' | 'findDrive' | 'bookDonation'
  | 'bloodTypeGuide' | 'eligibilityCheck' | 'emergencyRequests'
  | 'donorCertificates' | 'platform' | 'services' | 'getInvolved'
  | 'bloodDonationPlatform' | 'becomeRegularDonor' | 'everyThreeMonths'
  | 'registerToday' | 'donationsOpen' | 'allRightsReserved' | 'everyDropCounts'
  | 'bloodcareSystem' | 'connectingDonors'
  | 'everyDonationMatters' | 'giveBlood' | 'giveLife' | 'heroDescription' | 'whyChoose'
  | 'whyChooseDescription' | 'howItWorksTitle' | 'communityStories' | 'nearbyNeedsHelp'
  | 'registrationDescription' | 'becomeDonor' | 'livesSaved' | 'registeredDonors'
  | 'partnerHospitals' | 'citiesCovered' | 'fastMatching' | 'verifiedSafe' | 'localNetwork'
  | 'trackImpact' | 'contactUs' | 'getInTouch' | 'contactDescription' | 'messageSent'
  | 'messageSentDescription' | 'fullName' | 'phone' | 'phoneOptional' | 'email' | 'subject'
  | 'message' | 'sendMessage' | 'sending' | 'selectSubject' | 'generalInquiry'
  | 'bloodDonation' | 'organizeDrive' | 'volunteerOpportunity' | 'feedback' | 'other'
  | 'findUs' | 'connectWithUs' | 'quickResponse' | 'quickResponseDescription'
  | 'yourRegistrations' | 'loadingDonations' | 'noRegistrations' | 'headToDonate'
  | 'helpQuestion' | 'reachTeam' | 'registerDonate' | 'thankYou'
  | 'yourBloodCanSave' | 'saveLives' | 'whyDonateBlood' | 'simpleDonationProcess'
  | 'mythsFacts' | 'whoCanDonate' | 'readyDifference' | 'featureDescription'
  | 'registration' | 'healthCheck' | 'donation' | 'refreshment'
  | 'submitting' | 'registerAsDonor' | 'bloodType' | 'phoneNumber' | 'city'
  | 'fromYourAccount' | 'preferredDate' | 'additionalNotes' | 'selectBloodType' | 'bloodTypeRequired' | 'donorRegistrationReceived'
  | 'passwordRequired' | 'passwordMinLength' | 'passwordLabel' | 'noAccountFound' | 'wrongPassword'
  | 'tooManyRequests' | 'signInFailed' | 'enterEmailAboveForgotPassword'
  | 'healthcareManagementPlatform' | 'welcomeBack' | 'signInDashboard'
  | 'orContinueWithEmail' | 'passwordResetSent' | 'emailAddress' | 'emailPlaceholder'
  | 'passwordPlaceholder' | 'showPassword' | 'hidePassword' | 'forgotPassword'
  | 'signingIn' | 'noAccountYet' | 'createOne' | 'terms' | 'privacyPolicy'
  | 'oauthNotEnabled' | 'oauthSignInFailed' | 'resetEmailFailed'
  | 'signInWithGoogle' | 'signInWithGitHub'
  | 'registerAnotherDonor' | 'confirmDonationSlot'
  // Sign-up page keys
  | 'tagline' | 'createAccount' | 'createAccountSub' | 'google' | 'github' | 'orEmail'
  | 'successCreated' | 'username' | 'country' | 'emailLabel' | 'receiveUpdates'
  | 'creatingAccount' | 'createAccountBtn' | 'alreadyHave' | 'byContinuing' | 'privacy'
  | 'validation_username_required' | 'validation_username_len'
  | 'validation_email_required' | 'validation_email_invalid'
  | 'validation_password_required' | 'validation_password_len'
  | 'validation_country_required'
  | 'oauthFailed' | 'err_email_in_use' | 'err_weak_password' | 'err_operation_not_allowed'
  | 'registration_failed'
  | 'passwordWeak' | 'passwordFair' | 'passwordGood' | 'passwordStrong';

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    home: 'Home', whyDonate: 'Why Donate', donateNow: 'Donate Now', contact: 'Contact',
    dashboard: 'Dashboard', signIn: 'Sign In', signUp: 'Sign Up', signedInAs: 'Signed in as',
    profile: 'My Profile', adminDashboard: 'Admin Dashboard', signOut: 'Sign Out', admin: 'Admin',
    overview: 'Overview', howItWorks: 'How It Works', findDrive: 'Find a Drive',
    bookDonation: 'Book a Donation', bloodTypeGuide: 'Blood Type Guide', eligibilityCheck: 'Eligibility Check',
    emergencyRequests: 'Emergency Requests', donorCertificates: 'Donor Certificates', platform: 'Platform',
    services: 'Services', getInvolved: 'Get Involved', bloodDonationPlatform: 'Blood Donation Platform',
    becomeRegularDonor: 'Become a Regular Donor', everyThreeMonths: 'Every 3 months, save 3 lives',
    registerToday: 'Register today and get notified whenever your blood type is urgently needed nearby.',
    donationsOpen: 'Donations Open', allRightsReserved: 'All rights reserved.', everyDropCounts: 'Every Drop Counts',
    bloodcareSystem: 'BloodCare System', connectingDonors: 'Connecting donors, hospitals, and blood banks on one platform — so no patient waits for the blood they need.',
    everyDonationMatters: 'Every donation matters', giveBlood: 'Give Blood,', giveLife: 'Give Life', heroDescription: 'BloodCare connects willing donors with patients in urgent need. Register in minutes, get matched nearby, and help save a life today.', whyChoose: 'Why Choose BloodCare', whyChooseDescription: 'Built to make giving and receiving blood faster, safer, and easier for everyone involved.', howItWorksTitle: 'How It Works', communityStories: 'Stories From Our Community', nearbyNeedsHelp: 'Someone Nearby Needs Your Help', registrationDescription: 'Registration takes a few minutes. Your next donation could be the one that saves a life tomorrow.', becomeDonor: 'Become a Donor', livesSaved: 'Lives Saved', registeredDonors: 'Registered Donors', partnerHospitals: 'Partner Hospitals', citiesCovered: 'Cities Covered', fastMatching: 'Fast Matching', verifiedSafe: 'Verified & Safe', localNetwork: 'Local Network', trackImpact: 'Track Your Impact', contactUs: 'Contact Us', getInTouch: 'Get In Touch', contactDescription: 'Have questions about blood donation? Want to organize a blood drive? We’re here to help. Reach out to us anytime.', messageSent: 'Message Sent!', messageSentDescription: 'Thank you for reaching out. Our team will get back to you within 24 hours.', fullName: 'Full Name', phone: 'Phone', phoneOptional: 'Phone (Optional)', email: 'Email', subject: 'Subject', message: 'Message', sendMessage: 'Send Message', sending: 'Sending...', selectSubject: 'Select a subject', generalInquiry: 'General Inquiry', bloodDonation: 'Blood Donation', organizeDrive: 'Organize Blood Drive', volunteerOpportunity: 'Volunteer Opportunity', feedback: 'Feedback', other: 'Other', findUs: 'Find Us', connectWithUs: 'Connect With Us', quickResponse: 'Quick Response', quickResponseDescription: 'We typically respond within 24 hours during business days.', yourRegistrations: 'Your Registrations', loadingDonations: 'Loading your donations...', noRegistrations: 'No donation registrations yet.', headToDonate: 'Head to Donate Now to register as a donor.', helpQuestion: 'Need help or have a question?', reachTeam: 'Reach out to our team any time.', registerDonate: 'Register to Donate', thankYou: 'Thank You!', yourBloodCanSave: 'Your Blood Can', saveLives: 'Save Lives', whyDonateBlood: 'Why Donate Blood', simpleDonationProcess: 'Simple Donation Process', mythsFacts: 'Common Myths vs Facts', whoCanDonate: 'Who Can Donate?', readyDifference: 'Ready to Make a Difference?', featureDescription: 'Discover why blood donation is crucial and how you can make a difference in your community.', registration: 'Registration', healthCheck: 'Health Check', donation: 'Donation', refreshment: 'Refreshment', submitting: 'Submitting...', registerAsDonor: 'Register as Donor', bloodType: 'Blood Type', phoneNumber: 'Phone Number', city: 'City', fromYourAccount: 'from your account', preferredDate: 'Preferred Date', additionalNotes: 'Additional Notes (optional)', selectBloodType: 'Please select your blood type to continue.', bloodTypeRequired: 'Please select a blood type', donorRegistrationReceived: 'Your donor registration has been received. We’ll contact you at', confirmDonationSlot: 'to confirm your donation slot.', registerAnotherDonor: 'Register Another Donor',
    passwordRequired: 'Password is required',
    passwordMinLength: 'Password must be at least 6 characters',
    passwordLabel: 'Password',
    noAccountFound: 'No account found with this email',
    wrongPassword: 'Incorrect password',
    tooManyRequests: 'Too many attempts. Please try again later',
    signInFailed: 'Sign in failed. Please try again',
    enterEmailAboveForgotPassword: 'Enter your email above to reset your password',
    healthcareManagementPlatform: 'Healthcare Management Platform',
    welcomeBack: 'Welcome Back',
    signInDashboard: 'Sign in to access your dashboard',
    orContinueWithEmail: 'Or continue with email',
    passwordResetSent: 'Password reset email sent! Check your inbox.',
    emailAddress: 'Email Address',
    emailPlaceholder: 'you@example.com',
    passwordPlaceholder: 'Enter your password',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    forgotPassword: 'Forgot password?',
    signingIn: 'Signing in...',
    noAccountYet: "Don't have an account yet?",
    createOne: 'Create one',
    terms: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    oauthNotEnabled: 'This sign-in method is not enabled',
    oauthSignInFailed: 'Sign in failed. Please try again',
    resetEmailFailed: 'Failed to send reset email. Please try again',
    signInWithGoogle: 'Google',
    signInWithGitHub: 'GitHub',
    // Sign-up page
    tagline: 'Healthcare Management Platform',
    createAccount: 'Create Account',
    createAccountSub: 'Join us to manage your healthcare journey',
    google: 'Google',
    github: 'GitHub',
    orEmail: 'Or sign up with email',
    successCreated: 'Account created successfully! Redirecting...',
    username: 'Username',
    country: 'Country',
    emailLabel: 'Email',
    receiveUpdates: 'I would like to receive updates and health tips via email',
    creatingAccount: 'Creating account...',
    createAccountBtn: 'Create Account',
    alreadyHave: 'Already have an account?',
    byContinuing: 'By continuing, you agree to our',
    privacy: 'Privacy Policy',
    validation_username_required: 'Username is required',
    validation_username_len: 'Username must be at least 3 characters',
    validation_email_required: 'Email is required',
    validation_email_invalid: 'Please enter a valid email address',
    validation_password_required: 'Password is required',
    validation_password_len: 'Password must be at least 8 characters',
    validation_country_required: 'Country is required',
    oauthFailed: 'Sign in failed. Please try again',
    err_email_in_use: 'An account with this email already exists',
    err_weak_password: 'Password is too weak. Please choose a stronger one',
    err_operation_not_allowed: 'This sign-up method is not enabled',
    registration_failed: 'Registration failed. Please try again',
    passwordWeak: 'Weak',
    passwordFair: 'Fair',
    passwordGood: 'Good',
    passwordStrong: 'Strong'
  },
  ta: {
    home: 'முகப்பு', whyDonate: 'ஏன் நன்கொடை?', donateNow: 'இப்போது நன்கொடை', contact: 'தொடர்பு',
    dashboard: 'கட்டுப்பாட்டு பலகை', signIn: 'உள்நுழை', signUp: 'பதிவு செய்', signedInAs: 'உள்நுழைந்தவர்',
    profile: 'என் சுயவிவரம்', adminDashboard: 'நிர்வாக பலகை', signOut: 'வெளியேறு', admin: 'நிர்வாகம்',
    overview: 'கண்ணோட்டம்', howItWorks: 'எவ்வாறு செயல்படுகிறது', findDrive: 'நன்கொடை மையம் தேடு',
    bookDonation: 'நன்கொடை பதிவு', bloodTypeGuide: 'இரத்த வகை வழிகாட்டி', eligibilityCheck: 'தகுதி சரிபார்ப்பு',
    emergencyRequests: 'அவசர கோரிக்கைகள்', donorCertificates: 'நன்கொடையாளர் சான்றிதழ்கள்', platform: 'தளம்',
    services: 'சேவைகள்', getInvolved: 'பங்கேற்கவும்', bloodDonationPlatform: 'இரத்த நன்கொடை தளம்',
    becomeRegularDonor: 'தொடர்ச்சியான நன்கொடையாளராகுங்கள்', everyThreeMonths: 'ஒவ்வொரு 3 மாதமும் 3 உயிர்களை காப்பாற்றுங்கள்',
    registerToday: 'இன்றே பதிவு செய்து, உங்கள் இரத்த வகை அருகில் அவசரமாக தேவைப்படும் போது அறிவிப்பைப் பெறுங்கள்.',
    donationsOpen: 'நன்கொடைகள் திறந்துள்ளன', allRightsReserved: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.', everyDropCounts: 'ஒவ்வொரு துளியும் முக்கியம்',
    bloodcareSystem: 'BloodCare அமைப்பு', connectingDonors: 'நன்கொடையாளர்கள், மருத்துவமனைகள் மற்றும் இரத்த வங்கிகளை ஒரே தளத்தில் இணைக்கிறோம் — எந்த நோயாளியும் தேவையான இரத்தத்திற்காக காத்திருக்க வேண்டாம்.',
    everyDonationMatters: 'ஒவ்வொரு நன்கொடையும் முக்கியம்', giveBlood: 'இரத்தம் கொடுங்கள்,', giveLife: 'உயிர் காப்பாற்றுங்கள்', heroDescription: 'BloodCare அவசரமாக இரத்தம் தேவைப்படும் நோயாளிகளுடன் நன்கொடையாளர்களை இணைக்கிறது. சில நிமிடங்களில் பதிவு செய்து உயிரைக் காப்பாற்றுங்கள்.', whyChoose: 'BloodCare-ஐ ஏன் தேர்வு செய்ய வேண்டும்', whyChooseDescription: 'இரத்தம் வழங்குவதையும் பெறுவதையும் வேகமாகவும் பாதுகாப்பாகவும் எளிதாக்கும் தளம்.', howItWorksTitle: 'இது எவ்வாறு செயல்படுகிறது', communityStories: 'எங்கள் சமூகத்தின் கதைகள்', nearbyNeedsHelp: 'அருகில் உள்ள ஒருவருக்கு உங்கள் உதவி தேவை', registrationDescription: 'பதிவு செய்ய சில நிமிடங்களே ஆகும். உங்கள் அடுத்த நன்கொடை நாளை ஒரு உயிரைக் காப்பாற்றலாம்.', becomeDonor: 'நன்கொடையாளராகுங்கள்', livesSaved: 'காப்பாற்றப்பட்ட உயிர்கள்', registeredDonors: 'பதிவு செய்த நன்கொடையாளர்கள்', partnerHospitals: 'கூட்டு மருத்துவமனைகள்', citiesCovered: 'சேவை நகரங்கள்', fastMatching: 'வேகமான பொருத்தம்', verifiedSafe: 'சரிபார்க்கப்பட்டதும் பாதுகாப்பானதும்', localNetwork: 'உள்ளூர் வலைப்பின்னல்', trackImpact: 'உங்கள் தாக்கத்தைப் பாருங்கள்', contactUs: 'எங்களைத் தொடர்பு கொள்ளுங்கள்', getInTouch: 'தொடர்பு கொள்ளுங்கள்', contactDescription: 'இரத்த நன்கொடை பற்றி கேள்விகள் உள்ளதா? இரத்த முகாம் ஏற்பாடு செய்ய வேண்டுமா? நாங்கள் உதவ தயாராக உள்ளோம்.', messageSent: 'செய்தி அனுப்பப்பட்டது!', messageSentDescription: 'தொடர்பு கொண்டதற்கு நன்றி. எங்கள் குழு 24 மணி நேரத்திற்குள் பதிலளிக்கும்.', fullName: 'முழுப் பெயர்', phone: 'தொலைபேசி', phoneOptional: 'தொலைபேசி (விருப்பம்)', email: 'மின்னஞ்சல்', subject: 'தலைப்பு', message: 'செய்தி', sendMessage: 'செய்தி அனுப்பு', sending: 'அனுப்புகிறது...', selectSubject: 'தலைப்பைத் தேர்ந்தெடுக்கவும்', generalInquiry: 'பொதுவான விசாரணை', bloodDonation: 'இரத்த நன்கொடை', organizeDrive: 'இரத்த முகாம் ஏற்பாடு', volunteerOpportunity: 'தன்னார்வ வாய்ப்பு', feedback: 'கருத்து', other: 'மற்றவை', findUs: 'எங்களைக் காணுங்கள்', connectWithUs: 'எங்களுடன் இணைந்திருங்கள்', quickResponse: 'விரைவான பதில்', quickResponseDescription: 'வேலை நாட்களில் 24 மணி நேரத்திற்குள் பதிலளிப்போம்.', yourRegistrations: 'உங்கள் பதிவுகள்', loadingDonations: 'உங்கள் நன்கொடைகள் ஏற்றப்படுகின்றன...', noRegistrations: 'இதுவரை நன்கொடை பதிவுகள் இல்லை.', headToDonate: 'நன்கொடையாளராக பதிவு செய்ய இப்போது நன்கொடை பகுதிக்குச் செல்லுங்கள்.', helpQuestion: 'உதவி அல்லது கேள்வி உள்ளதா?', reachTeam: 'எங்கள் குழுவை எப்போது வேண்டுமானாலும் தொடர்பு கொள்ளுங்கள்.', registerDonate: 'நன்கொடைக்கு பதிவு செய்', thankYou: 'நன்றி!', yourBloodCanSave: 'உங்கள் இரத்தம்', saveLives: 'உயிர்களைக் காப்பாற்றும்', whyDonateBlood: 'ஏன் இரத்தம் வழங்க வேண்டும்', simpleDonationProcess: 'எளிய நன்கொடை செயல்முறை', mythsFacts: 'பொதுவான நம்பிக்கைகள் மற்றும் உண்மைகள்', whoCanDonate: 'யார் நன்கொடை வழங்கலாம்?', readyDifference: 'மாற்றத்தை உருவாக்க தயாரா?', featureDescription: 'இரத்த நன்கொடை ஏன் முக்கியம் என்றும் உங்கள் சமூகத்தில் எவ்வாறு மாற்றத்தை உருவாக்கலாம் என்றும் அறியுங்கள்.', registration: 'பதிவு', healthCheck: 'உடல்நல பரிசோதனை', donation: 'நன்கொடை', refreshment: 'சிற்றுண்டி', submitting: 'சமர்ப்பிக்கிறது...', registerAsDonor: 'நன்கொடையாளராக பதிவு செய்', bloodType: 'இரத்த வகை', phoneNumber: 'தொலைபேசி எண்', city: 'நகரம்', fromYourAccount: 'உங்கள் கணக்கிலிருந்து', preferredDate: 'விருப்பமான தேதி', additionalNotes: 'கூடுதல் குறிப்புகள் (விருப்பம்)', selectBloodType: 'தொடர உங்கள் இரத்த வகையைத் தேர்ந்தெடுக்கவும்.', bloodTypeRequired: 'இரத்த வகையைத் தேர்ந்தெடுக்கவும்', donorRegistrationReceived: 'உங்கள் நன்கொடையாளர் பதிவு பெறப்பட்டது. உங்களைத் தொடர்பு கொள்வோம்', confirmDonationSlot: 'உங்கள் நன்கொடை நேரத்தை உறுதிப்படுத்த.', registerAnotherDonor: 'மற்றொரு நன்கொடையாளரை பதிவு செய்',
    passwordRequired: 'கடவுச்சொல் தேவை',
    passwordMinLength: 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்',
    passwordLabel: 'கடவுச்சொல்',
    noAccountFound: 'இந்த மின்னஞ்சலுடன் கணக்கு எதுவும் இல்லை',
    wrongPassword: 'தவறான கடவுச்சொல்',
    tooManyRequests: 'அதிக முயற்சிகள். பின்னர் மீண்டும் முயற்சிக்கவும்',
    signInFailed: 'உள்நுழைவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்',
    enterEmailAboveForgotPassword: 'கடவுச்சொல்லை மீட்டமைக்க மேலே உங்கள் மின்னஞ்சலை உள்ளிடவும்',
    healthcareManagementPlatform: 'சுகாதார மேலாண்மை தளம்',
    welcomeBack: 'மீண்டும் வருக',
    signInDashboard: 'உங்கள் கட்டுப்பாட்டு பலகையை அணுக உள்நுழையவும்',
    orContinueWithEmail: 'அல்லது மின்னஞ்சல் மூலம் தொடரவும்',
    passwordResetSent: 'கடவுச்சொல் மீட்டமைப்பு மின்னஞ்சல் அனுப்பப்பட்டது! உங்கள் இன்பாக்ஸைச் சரிபார்க்கவும்.',
    emailAddress: 'மின்னஞ்சல் முகவரி',
    emailPlaceholder: 'you@example.com',
    passwordPlaceholder: 'உங்கள் கடவுச்சொல்லை உள்ளிடவும்',
    showPassword: 'கடவுச்சொல்லைக் காட்டு',
    hidePassword: 'கடவுச்சொல்லை மறை',
    forgotPassword: 'கடவுச்சொல் மறந்துவிட்டதா?',
    signingIn: 'உள்நுழைகிறது...',
    noAccountYet: 'இன்னும் கணக்கு இல்லையா?',
    createOne: 'ஒன்றை உருவாக்கவும்',
    terms: 'சேவை விதிமுறைகள்',
    privacyPolicy: 'தனியுரிமைக் கொள்கை',
    oauthNotEnabled: 'இந்த உள்நுழைவு முறை இயக்கப்படவில்லை',
    oauthSignInFailed: 'உள்நுழைவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்',
    resetEmailFailed: 'மீட்டமைப்பு மின்னஞ்சலை அனுப்ப முடியவில்லை. மீண்டும் முயற்சிக்கவும்',
    signInWithGoogle: 'Google',
    signInWithGitHub: 'GitHub',
    // Sign-up page
    tagline: 'சுகாதார மேலாண்மை தளம்',
    createAccount: 'கணக்கை உருவாக்கவும்',
    createAccountSub: 'உங்கள் சுகாதார பயணத்தை நிர்வகிக்க எங்களுடன் இணையுங்கள்',
    google: 'Google',
    github: 'GitHub',
    orEmail: 'அல்லது மின்னஞ்சல் மூலம் பதிவு செய்யவும்',
    successCreated: 'கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது! திருப்பி விடப்படுகிறது...',
    username: 'பயனர்பெயர்',
    country: 'நாடு',
    emailLabel: 'மின்னஞ்சல்',
    receiveUpdates: 'மின்னஞ்சல் மூலம் புதுப்பிப்புகள் மற்றும் சுகாதார குறிப்புகளைப் பெற விரும்புகிறேன்',
    creatingAccount: 'கணக்கை உருவாக்குகிறது...',
    createAccountBtn: 'கணக்கை உருவாக்கவும்',
    alreadyHave: 'ஏற்கனவே கணக்கு உள்ளதா?',
    byContinuing: 'தொடர்வதன் மூலம், நீங்கள் எங்கள் ஒப்புக்கொள்கிறீர்கள்',
    privacy: 'தனியுரிமைக் கொள்கை',
    validation_username_required: 'பயனர்பெயர் தேவை',
    validation_username_len: 'பயனர்பெயர் குறைந்தது 3 எழுத்துகள் இருக்க வேண்டும்',
    validation_email_required: 'மின்னஞ்சல் தேவை',
    validation_email_invalid: 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்',
    validation_password_required: 'கடவுச்சொல் தேவை',
    validation_password_len: 'கடவுச்சொல் குறைந்தது 8 எழுத்துகள் இருக்க வேண்டும்',
    validation_country_required: 'நாடு தேவை',
    oauthFailed: 'உள்நுழைவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்',
    err_email_in_use: 'இந்த மின்னஞ்சலுடன் ஏற்கனவே ஒரு கணக்கு உள்ளது',
    err_weak_password: 'கடவுச்சொல் மிகவும் பலவீனமானது. வலுவான ஒன்றைத் தேர்ந்தெடுக்கவும்',
    err_operation_not_allowed: 'இந்த பதிவு முறை இயக்கப்படவில்லை',
    registration_failed: 'பதிவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்',
    passwordWeak: 'பலவீனமானது',
    passwordFair: 'நடுத்தரமானது',
    passwordGood: 'நல்லது',
    passwordStrong: 'வலுவானது'
  },
};

const featureTranslations: Record<Language, Record<string, string>> = {
  en: {
    stat1: 'People will need blood in their lifetime', stat2: 'Patients need blood each year in Sri Lanka', stat3: 'Of blood donations come from regular donors', stat4: 'Lives can be saved by 1 donation',
    reason1Title: 'Save Lives Daily', reason1Description: 'Every 2 seconds, someone in the world needs blood. Your single donation can save up to 3 lives.', reason2Title: 'Emergency Preparedness', reason2Description: 'Blood is critical during emergencies, accidents, and natural disasters. A steady supply ensures readiness.', reason3Title: 'Support Mothers & Babies', reason3Description: 'Pregnancy and childbirth complications often require blood. Help ensure safe deliveries.', reason4Title: 'Cancer & Chronic Illness', reason4Description: 'Many cancer patients and those with chronic conditions need regular blood transfusions.', reason5Title: 'Health Benefits for Donors', reason5Description: 'Regular blood donation helps maintain healthy iron levels and reduces the risk of certain diseases.', reason6Title: 'Community Responsibility', reason6Description: 'Blood is a community resource. By donating, you contribute to the health of your entire community.',
    process1Title: 'Registration', process1Description: 'Fill out a simple form with your basic health information.', process2Title: 'Health Check', process2Description: 'Quick hemoglobin test, blood pressure check, and medical history review.', process3Title: 'Donation', process3Description: 'The donation takes only 8-10 minutes. Relax while saving lives!', process4Title: 'Refreshment', process4Description: 'Enjoy complimentary snacks and drinks to restore your energy.',
    myth1: "I'll get an infection", fact1: "All equipment is sterile, single-use, and disposable. There's absolutely no risk of infection.", myth2: "It's painful", fact2: "You'll feel a small pinch when the needle is inserted, similar to a blood test.", myth3: "It's time-consuming", fact3: 'The entire process takes about 30-45 minutes, but the donation itself is only 8-10 minutes.', myth4: "I'm too old", fact4: "You can donate up to age 60 in Sri Lanka, and even older with doctor's approval.",
    age: 'Age', ageDetails: '18 to 60 years old', weight: 'Weight', weightDetails: 'Minimum 45 kg', health: 'Health', healthDetails: 'Generally healthy, no severe illnesses', lastDonation: 'Last Donation', lastDonationDetails: 'At least 3 months since last donation', hemoglobin: 'Hemoglobin', hemoglobinDetails: '>12.5 g/dL for women, >13.0 g/dL for men', pregnancy: 'Pregnancy', pregnancyDetails: 'Not pregnant or recently gave birth', mythLabel: 'Myth', factLabel: 'Fact', registerToDonate: 'Register to Donate', contactUsFeature: 'Contact Us',
  },
  ta: {
    stat1: 'வாழ்நாளில் இரத்தம் தேவைப்படும் மக்கள்', stat2: 'இலங்கையில் ஆண்டுதோறும் இரத்தம் தேவைப்படும் நோயாளிகள்', stat3: 'வழக்கமான நன்கொடையாளர்களிடமிருந்து வரும் நன்கொடைகள்', stat4: 'ஒரு நன்கொடையால் காப்பாற்றக்கூடிய உயிர்கள்',
    reason1Title: 'தினமும் உயிர்களைக் காப்பாற்றுங்கள்', reason1Description: 'ஒவ்வொரு 2 விநாடிகளிலும் ஒருவருக்கு இரத்தம் தேவைப்படுகிறது. உங்கள் ஒரு நன்கொடை 3 உயிர்கள் வரை காப்பாற்றும்.', reason2Title: 'அவசரநிலை தயார்நிலை', reason2Description: 'அவசரநிலைகள், விபத்துகள் மற்றும் இயற்கை பேரழிவுகளில் இரத்தம் முக்கியமானது. நிலையான இருப்பு தயார்நிலையை உறுதிப்படுத்துகிறது.', reason3Title: 'தாய்மார்கள் மற்றும் குழந்தைகளுக்கு ஆதரவு', reason3Description: 'கர்ப்பம் மற்றும் பிரசவ சிக்கல்களுக்கு பெரும்பாலும் இரத்தம் தேவைப்படும். பாதுகாப்பான பிரசவங்களுக்கு உதவுங்கள்.', reason4Title: 'புற்றுநோய் மற்றும் நீண்டகால நோய்கள்', reason4Description: 'பல புற்றுநோய் நோயாளிகளுக்கும் நீண்டகால நோயாளிகளுக்கும் வழக்கமான இரத்தமாற்றம் தேவைப்படுகிறது.', reason5Title: 'நன்கொடையாளர்களுக்கான ஆரோக்கிய நன்மைகள்', reason5Description: 'வழக்கமான இரத்த நன்கொடை ஆரோக்கியமான இரும்பு அளவை பராமரிக்க உதவுகிறது.', reason6Title: 'சமூகப் பொறுப்பு', reason6Description: 'இரத்தம் சமூகத்தின் வளமாகும். நன்கொடை வழங்குவதன் மூலம் உங்கள் சமூகத்தின் ஆரோக்கியத்திற்கு பங்களிக்கிறீர்கள்.',
    process1Title: 'பதிவு', process1Description: 'உங்கள் அடிப்படை உடல்நலத் தகவல்களுடன் எளிய படிவத்தை நிரப்புங்கள்.', process2Title: 'உடல்நல பரிசோதனை', process2Description: 'விரைவான ஹீமோகுளோபின் சோதனை, இரத்த அழுத்த சோதனை மற்றும் மருத்துவ வரலாறு ஆய்வு.', process3Title: 'நன்கொடை', process3Description: 'நன்கொடை 8-10 நிமிடங்கள் மட்டுமே ஆகும். உயிர்களைக் காப்பாற்றி மகிழுங்கள்!', process4Title: 'சிற்றுண்டி', process4Description: 'உங்கள் ஆற்றலை மீட்டெடுக்க சிற்றுண்டி மற்றும் பானங்களை அனுபவியுங்கள்.',
    myth1: 'எனக்கு தொற்று ஏற்படும்', fact1: 'அனைத்து உபகரணங்களும் கிருமியற்றவை, ஒருமுறை பயன்படுத்தக்கூடியவை. தொற்று ஏற்படும் ஆபத்து இல்லை.', myth2: 'இது வலிக்கும்', fact2: 'ஊசி செலுத்தும்போது இரத்தப் பரிசோதனை போல சிறிய குத்தலை மட்டுமே உணர்வீர்கள்.', myth3: 'இது அதிக நேரம் எடுக்கும்', fact3: 'முழு செயல்முறை 30-45 நிமிடங்கள் ஆகும்; நன்கொடை 8-10 நிமிடங்கள் மட்டுமே.', myth4: 'நான் மிகவும் வயதானவன்', fact4: 'இலங்கையில் 60 வயது வரை நன்கொடை வழங்கலாம்; மருத்துவர் அனுமதியுடன் அதற்கு மேல் வயதிலும் வழங்கலாம்.',
    age: 'வயது', ageDetails: '18 முதல் 60 வயது', weight: 'எடை', weightDetails: 'குறைந்தது 45 கிலோ', health: 'உடல்நலம்', healthDetails: 'பொதுவாக ஆரோக்கியம், கடுமையான நோய்கள் இல்லை', lastDonation: 'கடைசி நன்கொடை', lastDonationDetails: 'கடைசி நன்கொடையிலிருந்து குறைந்தது 3 மாதங்கள்', hemoglobin: 'ஹீமோகுளோபின்', hemoglobinDetails: 'பெண்கள் >12.5 g/dL, ஆண்கள் >13.0 g/dL', pregnancy: 'கர்ப்பம்', pregnancyDetails: 'கர்ப்பமாக இல்லை அல்லது சமீபத்தில் பிரசவிக்கவில்லை', mythLabel: 'நம்பிக்கை', factLabel: 'உண்மை', registerToDonate: 'நன்கொடைக்கு பதிவு செய்', contactUsFeature: 'எங்களைத் தொடர்பு கொள்ளுங்கள்',
  },
};

const contactTranslations: Record<Language, Record<string, string>> = {
  en: {
    location: 'Location', workingHours: 'Working Hours', contactNow: 'Contact Now →', fromYourAccount: 'from your account', writeMessage: 'Write your message here...', availableHours: 'Available Mon-Fri, 8AM - 8PM',
    nameRequired: 'Name is required', emailRequired: 'Email is required', validEmail: 'Please enter a valid email address', messageRequired: 'Message is required', validPhone: 'Please enter a valid phone number', failedMessage: 'Failed to send message. Please try again later.',
  },
  ta: {
    location: 'இடம்', workingHours: 'வேலை நேரம்', contactNow: 'இப்போது தொடர்பு கொள்ளுங்கள் →', fromYourAccount: 'உங்கள் கணக்கிலிருந்து', writeMessage: 'உங்கள் செய்தியை இங்கே எழுதுங்கள்...', availableHours: 'திங்கள்-வெள்ளி, காலை 8 முதல் இரவு 8 வரை',
    nameRequired: 'பெயர் தேவை', emailRequired: 'மின்னஞ்சல் தேவை', validEmail: 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்', messageRequired: 'செய்தி தேவை', validPhone: 'சரியான தொலைபேசி எண்ணை உள்ளிடவும்', failedMessage: 'செய்தியை அனுப்ப முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
  },
};


interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = window.localStorage.getItem('bloodcare-language');
    if (saved === 'ta' || saved === 'en') {
      startTransition(() => setLanguageState(saved));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('bloodcare-language', language);
    document.documentElement.lang = language === 'ta' ? 'ta' : 'en';
  }, [language]);

  const setLanguage = (nextLanguage: Language) => setLanguageState(nextLanguage);
  const toggleLanguage = () => setLanguageState((current) => current === 'en' ? 'ta' : 'en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t: (key) => translations[language][key as TranslationKey] ?? featureTranslations[language][key] ?? contactTranslations[language][key] ?? key }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function resolveTranslation(language: Language, key: TranslationKey | string) {
  return translations[language][key as TranslationKey] ?? featureTranslations[language][key] ?? contactTranslations[language][key] ?? key;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}