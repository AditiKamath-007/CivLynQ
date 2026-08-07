const defaultQuestions = [
  {
    id: "q_age",
    question: "What is your age group?",
    type: "single-choice",
    options: ["Under 18", "18-60", "Over 60"]
  },
  {
    id: "q_residency",
    question: "What is your residential status?",
    type: "single-choice",
    options: ["Resident Indian", "Non-Resident Indian (NRI)", "Foreign National"]
  },
  {
    id: "q_docs",
    question: "Which of these documents do you currently possess?",
    type: "multi-choice",
    options: ["Aadhaar Card", "PAN Card", "Voter ID", "Passport", "None of the above"]
  }
];

const mockAadhaarWorkflow = {
  goal: "Apply for a New Aadhaar Card",
  title: "Apply for a New Aadhaar Card",
  summary: "Step-by-step guide to applying for a new Aadhaar card as a Resident Indian.",
  totalEstimatedTime: "1-2 weeks",
  totalEstimatedCost: "Free",
  steps: [
    {
      id: "step_1",
      title: "Locate Enrollment Center",
      description: "Find the nearest Aadhaar enrollment center using the UIDAI portal.",
      governmentDepartment: "UIDAI",
      agency: "UIDAI",
      estimatedFee: "Free",
      cost: "Free",
      estimatedDays: "10 mins",
      estimatedTime: "10 mins",
      canBeDoneOnline: true,
      whyThisStepIsRequired: "UIDAI biometric enrollment must take place at an authorized enrollment center.",
      legalJargonSimplified: "You need an official center to take your fingerprints and iris scans.",
      prerequisites: ["Proof of Identity", "Proof of Address"],
      requiredDocuments: ["Proof of Identity (e.g. Voter ID, PAN)", "Proof of Address (e.g. Electricity Bill, Ration Card)"],
      subTasks: [
        { title: "Search enrollment center near pincode", isDocumentDraftable: false },
        { title: "Book an online appointment slot if available", isDocumentDraftable: false }
      ],
      tips: "Check if the center requires prior online booking or accepts walk-ins.",
      commonMistakes: ["Forgetting original identity documents.", "Spelling errors on the offline form."],
      officialUrl: "https://appointments.uidai.gov.in/easearch.aspx"
    },
    {
      id: "step_2",
      title: "Fill Enrollment Form",
      description: "Download and fill the Aadhaar enrollment form before visiting.",
      governmentDepartment: "UIDAI",
      agency: "UIDAI",
      estimatedFee: "Free",
      cost: "Free",
      estimatedDays: "15 mins",
      estimatedTime: "15 mins",
      canBeDoneOnline: true,
      whyThisStepIsRequired: "The form captures demographic details like name, address, and DOB.",
      legalJargonSimplified: "Fill in basic personal information accurately in capital letters.",
      prerequisites: ["Locate Center"],
      requiredDocuments: ["Completed Enrollment Form"],
      subTasks: [
        { title: "Download UIDAI enrollment form PDF", isDocumentDraftable: false },
        { title: "Draft Aadhaar Self-Declaration Affidavit", isDocumentDraftable: true }
      ],
      tips: "Use capital letters to fill the form. Ensure mobile number is correctly entered as it will be linked.",
      commonMistakes: ["Entering invalid phone number", "Mismatched address with proof document"],
      officialUrl: "https://uidai.gov.in/images/aadhaar_enrolment_correction_form_version_2.1.pdf"
    },
    {
      id: "step_3",
      title: "Visit Center with Documents",
      description: "Visit the center, submit the form with Proof of Identity (PoI) and Proof of Address (PoA). Provide biometrics.",
      governmentDepartment: "UIDAI",
      agency: "UIDAI",
      estimatedFee: "Free for new enrollment",
      cost: "Free for new enrollment",
      estimatedDays: "1-2 hours",
      estimatedTime: "1-2 hours",
      canBeDoneOnline: false,
      whyThisStepIsRequired: "Biometrics (fingerprints, iris, facial photograph) are collected in person.",
      legalJargonSimplified: "Physical verification ensures one unique Aadhaar per individual.",
      prerequisites: ["Filled enrollment form", "Original ID documents"],
      requiredDocuments: ["Proof of Identity (PoI)", "Proof of Address (PoA)"],
      subTasks: [
        { title: "Submit documents to operator", isDocumentDraftable: false },
        { title: "Complete fingerprint and iris scan", isDocumentDraftable: false },
        { title: "Collect acknowledgment slip with Enrollment ID (EID)", isDocumentDraftable: false }
      ],
      tips: "Take original documents; they will be scanned and returned. Keep the acknowledgment slip safe.",
      commonMistakes: ["Losing the enrollment acknowledgment slip before receiving card."],
      officialUrl: "https://myaadhaar.uidai.gov.in/"
    }
  ]
};

const mockPANWorkflow = {
  goal: "Apply for a New PAN Card",
  title: "Apply for a New PAN Card",
  summary: "Step-by-step guide to applying for a PAN card online (Form 49A).",
  totalEstimatedTime: "3-5 days",
  totalEstimatedCost: "Rs. 107",
  steps: [
    {
      id: "step_1",
      title: "Submit Online Application",
      description: "Fill Form 49A on the NSDL or UTIITSL portal.",
      governmentDepartment: "Income Tax Department / NSDL",
      agency: "Income Tax Department / NSDL",
      estimatedFee: "Rs. 107",
      cost: "Rs. 107",
      estimatedDays: "30 mins",
      estimatedTime: "30 mins",
      canBeDoneOnline: true,
      whyThisStepIsRequired: "Form 49A is the statutory application form for allotment of Permanent Account Number.",
      legalJargonSimplified: "Submit your personal details for tax identification.",
      prerequisites: ["Aadhaar Card with linked mobile"],
      requiredDocuments: ["Aadhaar Card (for e-KYC)"],
      subTasks: [
        { title: "Select Form 49A on NSDL Portal", isDocumentDraftable: false },
        { title: "Enter Aadhaar Number and personal details", isDocumentDraftable: false },
        { title: "Draft PAN Application Declaration", isDocumentDraftable: true }
      ],
      tips: "Using Aadhaar e-KYC makes the process completely paperless and faster.",
      commonMistakes: ["Name mismatch between Aadhaar and PAN application."],
      officialUrl: "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html"
    },
    {
      id: "step_2",
      title: "Payment and Authentication",
      description: "Pay the fee online and authenticate using Aadhaar OTP.",
      governmentDepartment: "NSDL",
      agency: "NSDL",
      estimatedFee: "Included in Step 1",
      cost: "Included in Step 1",
      estimatedDays: "10 mins",
      estimatedTime: "10 mins",
      canBeDoneOnline: true,
      whyThisStepIsRequired: "Online payment processes application and e-KYC authenticates identity digitally.",
      legalJargonSimplified: "Pay processing fee and verify with mobile OTP.",
      prerequisites: ["Active mobile number linked to Aadhaar"],
      requiredDocuments: [],
      subTasks: [
        { title: "Complete debit/credit card or UPI payment", isDocumentDraftable: false },
        { title: "Submit Aadhaar OTP", isDocumentDraftable: false }
      ],
      tips: "Ensure your Aadhaar is linked to your active mobile number to receive the OTP.",
      commonMistakes: ["Closing tab before payment confirmation is displayed."],
      officialUrl: "https://www.onlineservices.nsdl.com/"
    },
    {
      id: "step_3",
      title: "Receive e-PAN and Physical PAN",
      description: "e-PAN will be emailed in a few days. Physical card will be dispatched by post.",
      governmentDepartment: "Income Tax Department",
      agency: "Income Tax Department",
      estimatedFee: "Free",
      cost: "Free",
      estimatedDays: "2-5 days",
      estimatedTime: "2-5 days",
      canBeDoneOnline: true,
      whyThisStepIsRequired: "Final issuance of Permanent Account Number.",
      legalJargonSimplified: "Get your digital PAN instantly via email and physical card by mail.",
      prerequisites: ["Successful e-KYC and Payment"],
      requiredDocuments: [],
      subTasks: [
        { title: "Download PDF e-PAN from email", isDocumentDraftable: false }
      ],
      tips: "You can use the e-PAN immediately for all legal purposes.",
      commonMistakes: ["Incorrect communication address for physical card delivery."],
      officialUrl: "https://eportal.incometax.gov.in/"
    }
  ]
};

const mockDLWorkflow = {
  goal: "Apply for a Driving Licence",
  title: "Apply for a Driving Licence",
  summary: "Step-by-step guide to applying for a Driving Licence in India via Parivahan Sarathi.",
  totalEstimatedTime: "1-2 months",
  totalEstimatedCost: "Rs. 400",
  steps: [
    {
      id: "step_1",
      title: "Apply for Learner's Licence (LL)",
      description: "Submit LL application online and take the computer-based test.",
      governmentDepartment: "RTO / Parivahan",
      agency: "RTO / Parivahan",
      estimatedFee: "Rs. 200",
      cost: "Rs. 200",
      estimatedDays: "1 week",
      estimatedTime: "1 week",
      canBeDoneOnline: true,
      whyThisStepIsRequired: "A Learner's Licence is mandatory before applying for a permanent driving licence.",
      legalJargonSimplified: "Get a temporary permit to learn driving on public roads.",
      prerequisites: ["Age Proof (18+ for gear vehicle)", "Address Proof"],
      requiredDocuments: ["Age Proof (Aadhaar / Birth Cert)", "Address Proof", "Passport Size Photos"],
      subTasks: [
        { title: "Fill LL application on Parivahan Sarathi", isDocumentDraftable: false },
        { title: "Draft Medical Fitness Certificate Form 1-A", isDocumentDraftable: true },
        { title: "Take online stall test", isDocumentDraftable: false }
      ],
      tips: "Aadhaar authentication lets you take the LL test from home in some states.",
      commonMistakes: ["Failing to review traffic signs before taking the online test."],
      officialUrl: "https://sarathi.parivahan.gov.in/"
    },
    {
      id: "step_2",
      title: "Apply for Permanent DL",
      description: "After 30 days of getting LL, apply for permanent DL.",
      governmentDepartment: "RTO",
      agency: "RTO",
      estimatedFee: "Rs. 200",
      cost: "Rs. 200",
      estimatedDays: "30 days wait",
      estimatedTime: "30 days wait",
      canBeDoneOnline: true,
      whyThisStepIsRequired: "Indian Motor Vehicles Act mandates a 30-day learning period with LL before permanent DL test.",
      legalJargonSimplified: "Wait 30 days while practicing driving.",
      prerequisites: ["Valid Learner's Licence"],
      requiredDocuments: ["Learner's Licence Number"],
      subTasks: [
        { title: "Book slot for practical driving test", isDocumentDraftable: false }
      ],
      tips: "You must apply within 6 months of LL issuance.",
      commonMistakes: ["Waiting longer than 6 months (LL expires after 180 days)."],
      officialUrl: "https://sarathi.parivahan.gov.in/"
    },
    {
      id: "step_3",
      title: "Take Driving Test",
      description: "Visit the RTO with your vehicle for the practical driving test.",
      governmentDepartment: "RTO",
      agency: "RTO",
      estimatedFee: "Free",
      cost: "Free",
      estimatedDays: "1 day",
      estimatedTime: "1 day",
      canBeDoneOnline: false,
      whyThisStepIsRequired: "Evaluation of vehicle control and compliance with traffic rules.",
      legalJargonSimplified: "Demonstrate your driving skills to the motor vehicle inspector.",
      prerequisites: ["Slot confirmation", "Vehicle with valid papers and 'L' board"],
      requiredDocuments: ["Vehicle Documents (RC, Insurance, PUC)", "Original Learner's Licence"],
      subTasks: [
        { title: "Drive on track as instructed by inspector", isDocumentDraftable: false }
      ],
      tips: "Ensure the vehicle used for the test is of the same class you applied for.",
      commonMistakes: ["Not putting on seatbelt/helmet before starting vehicle."],
      officialUrl: "https://parivahan.gov.in/"
    }
  ]
};

function getMockQuestions(goal) {
  const goalLower = (goal || '').toLowerCase();
  if (goalLower.includes('aadhaar')) {
    return [
      ...defaultQuestions,
      {
        id: "q_aadhaar_type",
        question: "Is this for an adult or a child (Baal Aadhaar)?",
        type: "single-choice",
        options: ["Adult", "Child (Below 5 years)"]
      }
    ];
  }
  if (goalLower.includes('pan')) {
    return [
      ...defaultQuestions,
      {
        id: "q_pan_aadhaar",
        question: "Is your Aadhaar linked to your mobile number?",
        type: "single-choice",
        options: ["Yes", "No", "Not Sure"]
      }
    ];
  }
  if (goalLower.includes('driving') || goalLower.includes('licence') || goalLower.includes('license')) {
    return [
      ...defaultQuestions,
      {
        id: "q_dl_learner",
        question: "Do you already have a Learner's Licence?",
        type: "single-choice",
        options: ["Yes", "No"]
      }
    ];
  }
  
  return defaultQuestions;
}

function getMockWorkflow(goal, answers) {
  const goalLower = (goal || '').toLowerCase();
  if (goalLower.includes('aadhaar')) return mockAadhaarWorkflow;
  if (goalLower.includes('pan')) return mockPANWorkflow;
  if (goalLower.includes('driving') || goalLower.includes('licence') || goalLower.includes('license')) return mockDLWorkflow;
  
  return {
    goal: goal || "Civic Process",
    title: "Guide: " + (goal || "Civic Process"),
    summary: "Based on your inputs, here is a general workflow for your request.",
    totalEstimatedTime: "1-2 weeks",
    totalEstimatedCost: "Varies",
    steps: [
      {
        id: "step_1",
        title: "Gather Initial Documents",
        description: "Collect your basic identity and address proofs.",
        governmentDepartment: "Relevant Authority",
        agency: "Relevant Authority",
        estimatedFee: "Free",
        cost: "Free",
        estimatedDays: "1 day",
        estimatedTime: "1 day",
        canBeDoneOnline: true,
        whyThisStepIsRequired: "Establishing valid proof of identity and address is mandatory.",
        legalJargonSimplified: "Collect your basic official ID proofs.",
        prerequisites: [],
        requiredDocuments: ["Identity Proof", "Address Proof"],
        subTasks: [
          { title: "Prepare self-attested copies", isDocumentDraftable: false },
          { title: "Draft Self-Declaration Affidavit", isDocumentDraftable: true }
        ],
        tips: "Always carry originals along with self-attested copies.",
        commonMistakes: ["Submitting expired documents."],
        officialUrl: ""
      },
      {
        id: "step_2",
        title: "Submit Application",
        description: "Submit the relevant form either online or at the local office.",
        governmentDepartment: "Relevant Authority",
        agency: "Relevant Authority",
        estimatedFee: "Applicable fees",
        cost: "Applicable fees",
        estimatedDays: "1-2 weeks",
        estimatedTime: "1-2 weeks",
        canBeDoneOnline: true,
        whyThisStepIsRequired: "Official submission for verification and processing.",
        legalJargonSimplified: "Submit form and receive tracking acknowledgment.",
        prerequisites: ["Initial Documents"],
        requiredDocuments: ["Completed Application Form"],
        subTasks: [
          { title: "Submit application form online or offline", isDocumentDraftable: false }
        ],
        tips: "Ask for a receipt or tracking number.",
        commonMistakes: ["Not retaining the tracking receipt."],
        officialUrl: ""
      }
    ]
  };
}

module.exports = {
  getMockQuestions,
  getMockWorkflow
};
