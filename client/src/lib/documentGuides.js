export const documentGuides = {
  'aadhaar-card': {
    title: 'Aadhaar Card',
    steps: [
      'Visit your nearest Aadhaar Enrolment Centre (find one at uidai.gov.in).',
      'Carry proof of identity (Passport, PAN, Voter ID) and proof of address (utility bill, bank statement).',
      'Fill out the Aadhaar enrolment form and provide biometric data (fingerprints + iris scan).',
      'You will receive an acknowledgement slip with a 14-digit Enrolment ID.',
      'Aadhaar is usually generated within 60–90 days and delivered by post; you can also download it from uidai.gov.in using your Enrolment ID.',
    ],
    link: 'https://uidai.gov.in',
    linkLabel: 'Visit UIDAI Portal',
  },
  'pan-card': {
    title: 'PAN Card',
    steps: [
      'Visit the official NSDL (Protean) or UTIITSL website for PAN applications.',
      'Select Form 49A (for Indian citizens) and fill out the required details.',
      'Upload required documents: Proof of Identity (like Aadhaar), Proof of Address, and Date of Birth proof.',
      'Pay the application fee online (usually around ₹107 for dispatch within India).',
      'You will receive an acknowledgement number to track your application. The PAN card is typically delivered within 15-20 days.',
    ],
    link: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
    linkLabel: 'Visit NSDL PAN Portal',
  },
  'voter-id': {
    title: 'Voter ID (EPIC)',
    steps: [
      'Visit the National Voters\' Services Portal (NVSP) at voters.eci.gov.in.',
      'Register/Login and select Form 6 for registering as a new voter.',
      'Fill in your personal details, family details, and address.',
      'Upload a recent passport-size photograph, age proof (e.g., Birth Certificate, Aadhaar), and address proof.',
      'Submit the form. You will get a reference ID to track your status. The Voter ID will be delivered to your address.',
    ],
    link: 'https://voters.eci.gov.in/',
    linkLabel: 'Visit Voters Portal',
  },
  'driving-license': {
    title: 'Driving License',
    steps: [
      'Visit the Parivahan Sewa portal (sarathi.parivahan.gov.in).',
      'Select your state and apply for a Learner\'s License (LL) first.',
      'Fill the form, upload documents (Age proof, Address proof), and pay the fee.',
      'Book a slot and take the LL test (can be done online in many states via Aadhaar authentication).',
      'After holding the LL for 30 days, apply for a permanent Driving License, book a driving test slot, and pass the practical test.',
    ],
    link: 'https://sarathi.parivahan.gov.in/',
    linkLabel: 'Visit Parivahan Portal',
  },
  'passport': {
    title: 'Passport',
    steps: [
      'Register on the Passport Seva portal (passportindia.gov.in).',
      'Login and click on "Apply for Fresh Passport/Re-issue of Passport".',
      'Fill in the application form online and submit it.',
      'Click "Pay and Schedule Appointment" to book a slot at your nearest Passport Seva Kendra (PSK).',
      'Visit the PSK on the appointment date with all original documents for verification.',
    ],
    link: 'https://www.passportindia.gov.in/',
    linkLabel: 'Visit Passport Seva',
  },
  'ration-card': {
    title: 'Ration Card',
    steps: [
      'Visit your State\'s Department of Food, Civil Supplies, and Consumer Affairs website.',
      'Look for the option to apply for a new Ration Card and download/fill the application form.',
      'Provide documents: Aadhaar cards of all family members, income certificate, and address proof.',
      'Submit the form online or at the local rationing office/Circle office.',
      'A field verification may be conducted before the card is issued.',
    ],
    link: 'https://nfsa.gov.in/',
    linkLabel: 'Visit NFSA Portal',
  },
  'gst-certificate': {
    title: 'GST Registration Certificate',
    steps: [
      'Visit the GST Portal at gst.gov.in.',
      'Go to Services > Registration > New Registration.',
      'Fill Part A (PAN, Mobile, Email) to get a Temporary Reference Number (TRN).',
      'Login with TRN and fill Part B with business details, promoters\' info, and principal place of business.',
      'Upload documents (PAN, Aadhaar, address proof for business, bank statement). Submit via Aadhaar OTP.',
    ],
    link: 'https://www.gst.gov.in/',
    linkLabel: 'Visit GST Portal',
  }
};

export const fallbackGuide = {
  steps: [
    'Identify which government agency issues this document (search "{document name} official site India").',
    'Visit the agency\'s official portal or your nearest government office.',
    'Fill out the application form and gather the required supporting documents (usually ID proof + address proof).',
    'Submit the application and pay any applicable fees.',
    'Collect your document (usually issued within 7–30 working days depending on the agency).',
  ],
  link: 'https://www.google.com/search?q=how+to+get+{slug}+india',
  linkLabel: 'Search for this document',
};

// 🤖 AI INTEGRATION POINT: when AI is wired, the teammate can replace getDocumentGuide() with a fetch to /api/documents/:id/guide for dynamic content.
export function getDocumentGuide(docIdOrName) {
  if (!docIdOrName) return null;
  const slug = docIdOrName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  if (documentGuides[slug]) return { ...documentGuides[slug], isFallback: false };
  // fallback: use the document name as the title, replace slug in the link
  return {
    title: docIdOrName,
    steps: fallbackGuide.steps,
    link: fallbackGuide.link.replace('{slug}', encodeURIComponent(`${docIdOrName} india`)),
    linkLabel: fallbackGuide.linkLabel,
    isFallback: true,
  };
}
