export const schemes = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN',
    description: 'Direct income support of ₹6,000 per year to small and marginal farmer families.',
    eligibility: [
      'Must be a small or marginal farmer family',
      'Must have cultivable landholding up to 2 hectares',
      'Must have Aadhaar card linked to bank account',
      'Not a government employee or income-tax payer',
    ],
    benefits: [
      '₹6,000 per year in three equal installments of ₹2,000 each',
      'Direct benefit transfer to bank account',
      'No intermediaries involved',
    ],
    howToApply: [
      'Visit the PM-KISAN portal (pmkisan.gov.in) or your local Common Service Centre (CSC)',
      'Fill in the self-registration form with Aadhaar, bank, and land details',
      'Upload scanned copies of land records',
      'Submit and note your registration number',
      'Track status online using your Aadhaar or mobile number',
    ],
    officialLinks: [
      { label: 'PM-KISAN Portal', url: 'https://pmkisan.gov.in' },
      { label: 'Beneficiary Status', url: 'https://pmkisan.gov.in/BeneficiaryStatus.aspx' },
    ],
  },
  {
    id: 'ayushman-bharat',
    name: 'Ayushman Bharat (PM-JAY)',
    description: 'Health insurance cover of ₹5 lakh per family per year for secondary and tertiary care hospitalization.',
    eligibility: [
      'Families listed in the SECC 2011 database',
      'Deprived rural households or identified urban worker families',
      'No age, gender, or family-size cap',
    ],
    benefits: [
      '₹5,00,000 health cover per family per year',
      'Cashless treatment at empanelled hospitals',
      'Covers pre- and post-hospitalization expenses',
      'No cap on family size or age of members',
    ],
    howToApply: [
      'Check eligibility on mera.pmjay.gov.in using your mobile number or ration card',
      'Visit your nearest Ayushman Mitra at an empanelled hospital or CSC',
      'Carry Aadhaar card and ration card for identity verification',
      'Get your e-card generated on the spot (free of cost)',
      'Use the e-card for cashless treatment at any empanelled hospital',
    ],
    officialLinks: [
      { label: 'PM-JAY Official', url: 'https://pmjay.gov.in' },
      { label: 'Am I Eligible?', url: 'https://mera.pmjay.gov.in' },
    ],
  },
  {
    id: 'mudra-loan',
    name: 'Pradhan Mantri Mudra Yojana (PMMY)',
    description: 'Collateral-free loans up to ₹10 lakh for micro and small enterprises.',
    eligibility: [
      'Any Indian citizen with a business plan for a non-farm income-generating activity',
      'Micro and small enterprises, including sole proprietorships and partnerships',
      'No collateral required for loans up to ₹10 lakh',
    ],
    benefits: [
      'Shishu: Loans up to ₹50,000',
      'Kishore: Loans from ₹50,001 to ₹5,00,000',
      'Tarun: Loans from ₹5,00,001 to ₹10,00,000',
      'Competitive interest rates, no processing fee in many banks',
    ],
    howToApply: [
      'Prepare a business plan or project proposal',
      'Visit any commercial bank, RRB, small finance bank, or MFI',
      'Fill the MUDRA loan application form',
      'Submit identity proof, address proof, and business-related documents',
      'Bank processes and disburses the loan within 7–10 working days',
    ],
    officialLinks: [
      { label: 'MUDRA Portal', url: 'https://www.mudra.org.in' },
    ],
  },
  {
    id: 'ujjwala',
    name: 'Pradhan Mantri Ujjwala Yojana (PMUY)',
    description: 'Free LPG connections to women from below-poverty-line households.',
    eligibility: [
      'Women belonging to BPL households (SECC 2011)',
      'Must be 18 years or older',
      'No existing LPG connection in the household',
      'SC/ST, Pradhan Mantri Awas Yojana beneficiaries, and most backward classes are also eligible',
    ],
    benefits: [
      'Free LPG connection (security deposit, pressure regulator, and LPG hose are covered)',
      'EMI facility for purchase of stove and first refill',
      'Direct subsidy transfer to bank account',
    ],
    howToApply: [
      'Visit the nearest LPG distributor (HP, Bharat, or Indane)',
      'Fill the Ujjwala application form (KYC form)',
      'Submit BPL certificate, Aadhaar, bank passbook, and a passport-size photo',
      'Distributor verifies and issues the connection within 7 days',
    ],
    officialLinks: [
      { label: 'PMUY Official', url: 'https://www.pmuy.gov.in' },
    ],
  },
  {
    id: 'sukanya-samriddhi',
    name: 'Sukanya Samriddhi Yojana (SSY)',
    description: 'Government-backed savings scheme for the girl child with attractive interest rates and tax benefits.',
    eligibility: [
      'Girl child below 10 years of age',
      'Only two accounts per family (one per girl child)',
      'Guardian must be an Indian resident',
    ],
    benefits: [
      'Current interest rate: ~8% per annum (government-set, revised quarterly)',
      'Tax-free returns under Section 80C',
      'Partial withdrawal allowed after girl turns 18 for education',
      'Matures when the girl turns 21',
    ],
    howToApply: [
      'Visit any post office or authorized commercial bank',
      'Fill the account-opening form',
      'Submit birth certificate of the girl child, ID and address proof of guardian',
      'Deposit minimum ₹250 (maximum ₹1.5 lakh per year)',
      'Receive the passbook for the SSY account',
    ],
    officialLinks: [
      { label: 'India Post SSY', url: 'https://www.indiapost.gov.in/Financial/pages/content/sukanya-samriddhi-account.aspx' },
    ],
  },
  {
    id: 'pm-awas-urban',
    name: 'Pradhan Mantri Awas Yojana – Urban (PMAY-U)',
    description: 'Affordable housing for urban poor with credit-linked subsidy on home loans.',
    eligibility: [
      'EWS / LIG / MIG families in urban areas',
      'Beneficiary family should not own a pucca house anywhere in India',
      'Aadhaar card mandatory for all adult family members',
    ],
    benefits: [
      'Interest subsidy of 6.5% for EWS/LIG on loans up to ₹6 lakh',
      'Interest subsidy of 4% for MIG-I on loans up to ₹9 lakh',
      'Interest subsidy of 3% for MIG-II on loans up to ₹12 lakh',
    ],
    howToApply: [
      'Apply online at pmaymis.gov.in or through a CSC',
      'Fill the online application with Aadhaar, income, and property details',
      'Upload required documents (Aadhaar, income certificate, property papers)',
      'Track application status using your application number',
    ],
    officialLinks: [
      { label: 'PMAY-U Portal', url: 'https://pmaymis.gov.in' },
    ],
  },
  {
    id: 'atal-pension',
    name: 'Atal Pension Yojana (APY)',
    description: 'Guaranteed minimum pension of ₹1,000–₹5,000/month for unorganized sector workers.',
    eligibility: [
      'Indian citizen aged 18–40 years',
      'Must have a savings bank account',
      'Not a member of any statutory social security scheme',
    ],
    benefits: [
      'Guaranteed pension of ₹1,000 to ₹5,000 per month after age 60',
      'Government co-contributes 50% of total contribution (up to ₹1,000/year) for 5 years for eligible subscribers',
      'Spouse receives same pension after subscriber\'s death',
    ],
    howToApply: [
      'Visit your bank branch or use net banking / mobile banking',
      'Fill the APY registration form',
      'Choose pension amount (₹1,000 / ₹2,000 / ₹3,000 / ₹4,000 / ₹5,000 per month)',
      'Auto-debit is set up from your savings account',
    ],
    officialLinks: [
      { label: 'APY – NSDL', url: 'https://www.npscra.nsdl.co.in/scheme-details.php' },
    ],
  },
  {
    id: 'stand-up-india',
    name: 'Stand-Up India',
    description: 'Bank loans between ₹10 lakh and ₹1 crore for SC/ST and women entrepreneurs.',
    eligibility: [
      'SC/ST and/or women entrepreneurs',
      'For setting up a greenfield enterprise in manufacturing, services, or trading',
      'Age 18 years and above',
      'Borrower should not be in default to any bank/financial institution',
    ],
    benefits: [
      'Composite loan (term loan + working capital) of ₹10 lakh to ₹1 crore',
      'Repayment period up to 7 years with maximum moratorium of 18 months',
      'Margin money of up to 25% (can be adjusted with eligible subsidies)',
    ],
    howToApply: [
      'Register on standupmitra.in',
      'Connect with a bank branch through the portal or visit directly',
      'Submit project report, identity, address, caste/category, and business registration documents',
      'Bank sanctions the loan after due diligence',
    ],
    officialLinks: [
      { label: 'Stand-Up India Portal', url: 'https://www.standupmitra.in' },
    ],
  },
  {
    id: 'pmsby',
    name: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
    description: 'Accidental death and disability insurance cover at ₹20/year.',
    eligibility: [
      'Savings bank account holders aged 18–70 years',
      'Aadhaar linked to bank account',
      'One policy per person',
    ],
    benefits: [
      '₹2 lakh for accidental death or total permanent disability',
      '₹1 lakh for partial permanent disability',
      'Annual premium of just ₹20, auto-debited from bank account',
    ],
    howToApply: [
      'Give consent to your bank (net banking, branch visit, or SMS)',
      'Premium of ₹20 is auto-debited annually from your savings account',
      'No medical examination required',
    ],
    officialLinks: [
      { label: 'Jansuraksha', url: 'https://jansuraksha.gov.in' },
    ],
  },
  {
    id: 'skill-india',
    name: 'Skill India Mission (PMKVY)',
    description: 'Free short-term skill training and certification with placement assistance.',
    eligibility: [
      'Indian nationals who are school/college dropouts or unemployed',
      'Age: generally 15–45 years (varies by course)',
      'Aadhaar and bank account required',
    ],
    benefits: [
      'Free skill training in 300+ job roles across 40 sectors',
      'Government-recognized certification',
      'Placement assistance after training',
      'Monetary reward (₹500–₹8,000) on successful certification',
    ],
    howToApply: [
      'Find a PMKVY training centre on skillindia.gov.in',
      'Enroll with Aadhaar and bank details',
      'Complete 150–300 hours of training',
      'Pass the assessment and receive certification',
    ],
    officialLinks: [
      { label: 'Skill India', url: 'https://www.skillindia.gov.in' },
      { label: 'PMKVY Portal', url: 'https://pmkvyofficial.org' },
    ],
  },
  {
    id: 'jan-dhan',
    name: 'Pradhan Mantri Jan Dhan Yojana (PMJDY)',
    description: 'Zero-balance savings bank accounts with RuPay debit card and accident insurance.',
    eligibility: [
      'Any Indian citizen aged 10 years or above',
      'No minimum balance requirement',
      'One account per person',
    ],
    benefits: [
      'Zero-balance savings account',
      'Free RuPay debit card with ₹2 lakh accident insurance cover',
      'Overdraft facility up to ₹10,000 for eligible accounts',
      'Direct Benefit Transfer (DBT) of government subsidies',
    ],
    howToApply: [
      'Visit any bank branch or Banking Correspondent outlet',
      'Fill the simplified account-opening form',
      'Submit one identity document (Aadhaar, Voter ID, Driving Licence, etc.)',
      'Receive your RuPay debit card and passbook',
    ],
    officialLinks: [
      { label: 'PMJDY Official', url: 'https://pmjdy.gov.in' },
    ],
  },
  {
    id: 'fasal-bima',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    description: 'Crop insurance against natural calamities, pests, and diseases at subsidized premiums.',
    eligibility: [
      'All farmers (both loanee and non-loanee) growing notified crops',
      'Sharecroppers and tenant farmers are also eligible',
    ],
    benefits: [
      'Premium: 2% for Kharif, 1.5% for Rabi, 5% for commercial/horticultural crops (government pays the rest)',
      'Full sum insured if crop loss exceeds threshold',
      'Use of satellite imagery and drones for quick claim settlement',
    ],
    howToApply: [
      'Visit the nearest bank branch, CSC, or use pmfby.gov.in portal',
      'Enroll before the cut-off date for the crop season',
      'Submit land records, sowing certificate, and bank account details',
      'Premium is debited from your account',
    ],
    officialLinks: [
      { label: 'PMFBY Portal', url: 'https://pmfby.gov.in' },
    ],
  },
];
