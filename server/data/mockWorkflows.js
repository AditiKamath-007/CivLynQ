const defaultQuestions = [
  {
    id: "state",
    question: "Which state do you reside in?",
    type: "single-choice",
    options: []
  },
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
  }
];

const mockAadhaarWorkflow = {
  goal: "Aadhaar Card (New / Update)",
  complexity: "Simple",
  summary: "Step-by-step guide to applying for a new Aadhaar card or updating existing details as a Resident Indian.",
  totalEstimatedTime: "2-3 weeks",
  totalEstimatedCost: "Free",
  steps: [
    {
      id: "step_1",
      title: "Locate Enrollment Center",
      description: "Find the nearest Aadhaar enrollment center using the UIDAI portal or call the helpline.",
      governmentDepartment: "UIDAI",
      estimatedFee: "Free",
      whyThisStepIsRequired: "Aadhaar enrollment and updates can only be done at authorized centers. You need to find one near you first.",
      legalJargonSimplified: "UIDAI operates through a network of authorized enrollment agencies. Each center has specific working hours and may require prior appointment.",
      requiredDocuments: [],
      prerequisites: [],
      officialUrl: "https://appointments.uidai.gov.in/easearch.aspx",
      estimatedDays: "10 minutes",
      tips: "Check if the center requires prior online booking or accepts walk-ins. Centers in malls and banks tend to have shorter queues.",
      commonMistakes: ["Not checking center operating hours before visiting", "Going to an unauthorized center"],
      canBeDoneOnline: true,
      subTasks: [
        "Search for centers on the UIDAI portal",
        "Note down center address and timings",
        "Book an appointment online if required"
      ]
    },
    {
      id: "step_2",
      title: "Fill Enrollment Form",
      description: "Download and fill the Aadhaar enrollment/correction form before visiting the center.",
      governmentDepartment: "UIDAI",
      estimatedFee: "Free",
      whyThisStepIsRequired: "The enrollment form captures your demographic and biometric information required for Aadhaar generation.",
      legalJargonSimplified: "Form fields include your full name, date of birth, gender, address, mobile number, and email. All fields must match your supporting documents exactly.",
      requiredDocuments: [],
      prerequisites: ["Enrollment center located (Step 1)"],
      officialUrl: "https://uidai.gov.in/images/aadhaar_enrolment_correction_form_version_2.1.pdf",
      estimatedDays: "15 minutes",
      tips: "Use CAPITAL LETTERS to fill the form. Ensure your mobile number is correctly entered as it will be linked to your Aadhaar.",
      commonMistakes: ["Name mismatch between form and supporting documents", "Incorrect mobile number entry"],
      canBeDoneOnline: false,
      subTasks: [
        "Download the enrollment form (PDF)",
        "Fill in personal details in capital letters",
        "Double-check mobile number and email"
      ]
    },
    {
      id: "step_3",
      title: "Visit Center with Documents",
      description: "Visit the enrollment center with the filled form, original Proof of Identity (PoI) and Proof of Address (PoA). Provide biometrics (fingerprints, iris scan, and photograph).",
      governmentDepartment: "UIDAI",
      estimatedFee: "Free for new enrollment",
      whyThisStepIsRequired: "In-person verification and biometric capture is mandatory for Aadhaar issuance as per the Aadhaar Act, 2016.",
      legalJargonSimplified: "You must physically visit the center so they can scan your fingerprints, take an iris scan, and photograph you. These biometrics are what make Aadhaar unique to you.",
      requiredDocuments: ["Proof of Identity (e.g., PAN, Passport, Voter ID)", "Proof of Address (e.g., Utility Bill, Bank Statement, Passport)", "Filled enrollment form"],
      prerequisites: ["Enrollment form filled (Step 2)", "Appointment booked if required (Step 1)"],
      officialUrl: "",
      estimatedDays: "1-2 hours",
      tips: "Carry original documents — they will be scanned and returned. Keep the acknowledgment slip safe; it has your Enrollment ID (EID) to track your Aadhaar status.",
      commonMistakes: ["Forgetting to carry original documents (only bringing photocopies)", "Not collecting the acknowledgment slip"],
      canBeDoneOnline: false,
      subTasks: [
        "Carry original + photocopy of ID and address proofs",
        "Submit filled enrollment form at the center",
        "Provide biometrics (fingerprints, iris, photo)",
        "Collect acknowledgment slip with EID"
      ]
    },
    {
      id: "step_4",
      title: "Track and Download Aadhaar",
      description: "Use your Enrollment ID (EID) to track your Aadhaar status online. Once generated, download your e-Aadhaar.",
      governmentDepartment: "UIDAI",
      estimatedFee: "Free",
      whyThisStepIsRequired: "After enrollment, UIDAI processes your application and generates a 12-digit Aadhaar number. You need to check when it's ready.",
      legalJargonSimplified: "Processing typically takes 15-90 days. You can download a digitally signed e-Aadhaar which is legally equivalent to the physical card.",
      requiredDocuments: ["Acknowledgment slip with EID"],
      prerequisites: ["Enrollment completed (Step 3)"],
      officialUrl: "https://myaadhaar.uidai.gov.in/",
      estimatedDays: "15-90 days",
      tips: "The e-Aadhaar PDF is password protected — the password is the first 4 letters of your name in capitals + your birth year (YYYY).",
      commonMistakes: ["Losing the acknowledgment slip before Aadhaar is generated", "Not knowing the e-Aadhaar PDF password format"],
      canBeDoneOnline: true,
      subTasks: [
        "Visit myaadhaar.uidai.gov.in",
        "Enter EID or Aadhaar number to check status",
        "Download e-Aadhaar PDF once available"
      ]
    }
  ]
};

const mockPANWorkflow = {
  goal: "PAN Card Application",
  complexity: "Simple",
  summary: "Complete guide to applying for a new PAN card online using Form 49A via NSDL or UTIITSL portal.",
  totalEstimatedTime: "1-2 weeks",
  totalEstimatedCost: "Rs. 107",
  steps: [
    {
      id: "step_1",
      title: "Submit Online Application (Form 49A)",
      description: "Fill Form 49A on the NSDL or UTIITSL portal. Choose the Aadhaar e-KYC option for a completely paperless process.",
      governmentDepartment: "Income Tax Department / NSDL",
      estimatedFee: "Rs. 107 (Indian applicants)",
      whyThisStepIsRequired: "PAN is mandatory for financial transactions above specified limits under the Income Tax Act, 1961.",
      legalJargonSimplified: "PAN (Permanent Account Number) is a 10-character alphanumeric code issued by the IT department. It's required for filing taxes, opening bank accounts, and transactions above Rs. 50,000.",
      requiredDocuments: ["Aadhaar Card (for e-KYC)", "Recent passport-size photograph"],
      prerequisites: ["Active mobile number linked to Aadhaar"],
      officialUrl: "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html",
      estimatedDays: "30 minutes",
      tips: "Using Aadhaar e-KYC makes the process completely paperless and much faster. No physical documents need to be sent.",
      commonMistakes: ["Not having Aadhaar linked to current mobile number", "Mismatched name between Aadhaar and application form"],
      canBeDoneOnline: true,
      subTasks: [
        "Visit the NSDL PAN portal",
        "Select 'New PAN - Indian Citizen (Form 49A)'",
        "Fill in personal details",
        "Upload photo and signature"
      ]
    },
    {
      id: "step_2",
      title: "Payment and Aadhaar OTP Authentication",
      description: "Pay the processing fee online and authenticate your identity via Aadhaar OTP sent to your registered mobile number.",
      governmentDepartment: "NSDL / UIDAI",
      estimatedFee: "Included in Step 1 fee",
      whyThisStepIsRequired: "OTP authentication verifies your identity electronically, eliminating the need for physical document submission.",
      legalJargonSimplified: "An OTP will be sent to the mobile number linked to your Aadhaar. Entering this OTP confirms that you are the person applying.",
      requiredDocuments: [],
      prerequisites: ["Application form filled (Step 1)"],
      officialUrl: "",
      estimatedDays: "10 minutes",
      tips: "Ensure your Aadhaar is linked to your active mobile number to receive the OTP. If not, visit an Aadhaar center to update your mobile number first.",
      commonMistakes: ["OTP expired before entering (it's valid for 10 minutes)", "Aadhaar linked to an old/inactive mobile number"],
      canBeDoneOnline: true,
      subTasks: [
        "Complete payment via debit card/net banking/UPI",
        "Enter Aadhaar OTP when prompted",
        "Save the acknowledgment number"
      ]
    },
    {
      id: "step_3",
      title: "Receive e-PAN and Physical PAN Card",
      description: "e-PAN will be emailed within 48 hours of successful verification. Physical PAN card will be dispatched by post within 15-20 days.",
      governmentDepartment: "Income Tax Department",
      estimatedFee: "Free",
      whyThisStepIsRequired: "This is the final step where your PAN is generated and dispatched to you.",
      legalJargonSimplified: "You'll receive a digitally signed e-PAN on your registered email. The e-PAN is legally valid for all purposes. The physical card follows by post.",
      requiredDocuments: [],
      prerequisites: ["Payment and authentication completed (Step 2)"],
      officialUrl: "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html",
      estimatedDays: "1-2 weeks",
      tips: "You can use the e-PAN immediately for all legal and financial purposes while waiting for the physical card.",
      commonMistakes: ["Not checking spam/junk folder for the e-PAN email", "Providing incorrect postal address for physical card delivery"],
      canBeDoneOnline: true,
      subTasks: [
        "Check email for e-PAN (within 48 hours)",
        "Download and save the e-PAN PDF",
        "Wait for physical card delivery"
      ]
    }
  ]
};

const mockDLWorkflow = {
  goal: "Driving Licence Application",
  complexity: "Complex",
  summary: "End-to-end guide to applying for a Driving Licence in India via the Parivahan Sarathi portal, from Learner's Licence to permanent DL.",
  totalEstimatedTime: "2-6 months",
  totalEstimatedCost: "Rs. 500-1000",
  steps: [
    {
      id: "step_1",
      title: "Apply for Learner's Licence (LL)",
      description: "Submit LL application online via Sarathi portal and schedule the computer-based test at your nearest RTO.",
      governmentDepartment: "RTO / Ministry of Road Transport",
      estimatedFee: "Rs. 200 (approx)",
      whyThisStepIsRequired: "A Learner's Licence is a mandatory prerequisite before applying for a permanent Driving Licence under the Motor Vehicles Act, 1988.",
      legalJargonSimplified: "You must first get a Learner's Licence, which allows you to practice driving under supervision for at least 30 days before you can take the permanent DL test.",
      requiredDocuments: ["Age Proof (Aadhaar/PAN/Birth Certificate)", "Address Proof (Aadhaar/Utility Bill/Passport)", "Passport-size photographs", "Medical certificate (Form 1A) for commercial vehicle applicants"],
      prerequisites: ["Must be at least 18 years old (16 for non-geared two-wheelers)"],
      officialUrl: "https://sarathi.parivahan.gov.in/",
      estimatedDays: "1 week",
      tips: "Some states allow Aadhaar authentication to take the LL test from home. Check if your state supports this before visiting the RTO.",
      commonMistakes: ["Applying for the wrong vehicle class", "Not carrying originals to the RTO on test day"],
      canBeDoneOnline: true,
      subTasks: [
        "Register on Sarathi portal",
        "Fill LL application form",
        "Upload documents and pay fees",
        "Schedule and pass the LL test"
      ]
    },
    {
      id: "step_2",
      title: "Practice Driving (30-day waiting period)",
      description: "After receiving your Learner's Licence, practice driving under supervision for at least 30 days before applying for the permanent DL.",
      governmentDepartment: "N/A",
      estimatedFee: "Free (driving school optional)",
      whyThisStepIsRequired: "The Motor Vehicles Act requires a minimum 30-day gap between LL issuance and DL application to ensure adequate driving practice.",
      legalJargonSimplified: "During this period, you can legally drive only with an experienced licensed driver sitting next to you. You must display an 'L' plate on the vehicle.",
      requiredDocuments: ["Learner's Licence"],
      prerequisites: ["LL received (Step 1)"],
      officialUrl: "",
      estimatedDays: "30-180 days",
      tips: "You must apply for the permanent DL within 180 days (6 months) of LL issuance, otherwise the LL expires and you'll have to start over.",
      commonMistakes: ["Waiting longer than 180 days (LL expires)", "Driving without an experienced licensed driver beside you"],
      canBeDoneOnline: false,
      subTasks: [
        "Practice driving regularly",
        "Consider enrolling in a driving school",
        "Ensure you practice with the same vehicle class as your LL"
      ]
    },
    {
      id: "step_3",
      title: "Apply for Permanent DL and Take Driving Test",
      description: "Submit DL application online, then visit the RTO with your vehicle for the practical driving test.",
      governmentDepartment: "RTO",
      estimatedFee: "Rs. 200-300 (approx)",
      whyThisStepIsRequired: "The practical driving test verifies your ability to safely operate a vehicle on public roads.",
      legalJargonSimplified: "You will be tested on your ability to drive through traffic, make turns, reverse, park, and handle the vehicle safely. The test vehicle must be of the same class you applied for.",
      requiredDocuments: ["Learner's Licence", "Vehicle Registration Certificate (RC)", "Vehicle Insurance", "Pollution Under Control (PUC) certificate"],
      prerequisites: ["LL valid and at least 30 days old (Step 2)"],
      officialUrl: "https://sarathi.parivahan.gov.in/",
      estimatedDays: "1 day",
      tips: "Ensure the vehicle used for the test is of the same class you applied for. Practice hill starts, parallel parking, and 8-figure driving.",
      commonMistakes: ["Using a vehicle of a different class than the LL", "Not carrying all vehicle documents (RC, Insurance, PUC)"],
      canBeDoneOnline: false,
      subTasks: [
        "Apply for DL test slot on Sarathi portal",
        "Pay the DL test fee",
        "Visit RTO with vehicle and all documents",
        "Pass the driving test",
        "Collect the DL receipt/tracking number"
      ]
    }
  ]
};

const mockFSSAIWorkflow = {
  goal: "FSSAI Food License Registration",
  complexity: "Medium",
  summary: "Guide to obtaining a Food Safety and Standards Authority of India (FSSAI) license for your food business.",
  totalEstimatedTime: "2-4 weeks",
  totalEstimatedCost: "Rs. 100-5000 (depends on license type)",
  steps: [
    {
      id: "step_1",
      title: "Determine License Type",
      description: "Based on your annual turnover and nature of food business, determine whether you need a Basic Registration, State License, or Central License.",
      governmentDepartment: "FSSAI",
      estimatedFee: "Free (consultation)",
      whyThisStepIsRequired: "Different scales of food business require different types of FSSAI licenses. Applying for the wrong one will delay your process.",
      legalJargonSimplified: "Basic Registration is for small businesses (turnover up to Rs. 12 lakh). State License is for mid-size businesses (Rs. 12 lakh - Rs. 20 crore). Central License is for large businesses.",
      requiredDocuments: ["Business PAN Card", "Business address proof"],
      prerequisites: [],
      officialUrl: "https://foscos.fssai.gov.in/",
      estimatedDays: "1 day",
      tips: "Most small restaurants, food trucks, and home-based food businesses only need Basic Registration, which is the simplest to obtain.",
      commonMistakes: ["Applying for a Central License when only a Basic Registration is needed"],
      canBeDoneOnline: true,
      subTasks: [
        "Check your annual food business turnover",
        "Determine the appropriate license category",
        "Visit the FSSAI FoSCoS portal"
      ]
    },
    {
      id: "step_2",
      title: "Submit Application on FoSCoS Portal",
      description: "Register on the FSSAI FoSCoS portal and submit your application with required documents.",
      governmentDepartment: "FSSAI",
      estimatedFee: "Rs. 100 (Basic) to Rs. 5000 (Central) per year",
      whyThisStepIsRequired: "The Food Safety and Standards Act, 2006 mandates that every food business operator must have an FSSAI license to legally operate.",
      legalJargonSimplified: "You must fill out the online form, upload your documents, and pay the fee. The 14-digit FSSAI license number must be displayed on all food packages and at your establishment.",
      requiredDocuments: ["ID Proof of proprietor/partners", "Business address proof", "Food safety plan", "NOC from local authority", "List of food products"],
      prerequisites: ["License type determined (Step 1)"],
      officialUrl: "https://foscos.fssai.gov.in/",
      estimatedDays: "1-2 weeks",
      tips: "Keep digital copies of all documents ready before starting the application. Photo should be in JPEG format, documents in PDF.",
      commonMistakes: ["Uploading documents in wrong format", "Incomplete food product list"],
      canBeDoneOnline: true,
      subTasks: [
        "Create account on FoSCoS portal",
        "Fill application form",
        "Upload required documents",
        "Pay application fee online"
      ]
    }
  ]
};

const mockGSTWorkflow = {
  goal: "GST Registration",
  complexity: "Medium",
  summary: "Step-by-step guide to registering for Goods and Services Tax (GST) on the GST portal.",
  totalEstimatedTime: "1-2 weeks",
  totalEstimatedCost: "Free",
  steps: [
    {
      id: "step_1",
      title: "Gather Required Documents",
      description: "Collect all necessary documents including PAN, Aadhaar, business registration, bank details, and address proof.",
      governmentDepartment: "Central Board of Indirect Taxes and Customs (CBIC)",
      estimatedFee: "Free",
      whyThisStepIsRequired: "GST registration is mandatory for businesses with turnover exceeding Rs. 40 lakh (Rs. 20 lakh for services) under the CGST Act, 2017.",
      legalJargonSimplified: "You need GST registration to collect tax from customers and claim input tax credit on your purchases. Without it, you cannot legally charge GST.",
      requiredDocuments: ["PAN Card of business/proprietor", "Aadhaar Card", "Business registration/incorporation certificate", "Address proof of business premises", "Bank account details with cancelled cheque", "Digital signature (for companies/LLPs)"],
      prerequisites: ["Business must be operational or about to commence"],
      officialUrl: "https://www.gst.gov.in/",
      estimatedDays: "1 day",
      tips: "Keep scanned copies ready in PDF format (max 1MB each). Aadhaar authentication speeds up the process significantly.",
      commonMistakes: ["PAN name not matching business registration name", "Using personal address instead of business address"],
      canBeDoneOnline: true,
      subTasks: [
        "Get PAN card for business entity",
        "Collect address proof documents",
        "Get cancelled cheque or bank statement"
      ]
    },
    {
      id: "step_2",
      title: "Submit Application on GST Portal",
      description: "Register on the GST portal and submit Form GST REG-01 with all required information and documents.",
      governmentDepartment: "CBIC / GST Network",
      estimatedFee: "Free",
      whyThisStepIsRequired: "The online application is the only way to obtain a GSTIN (GST Identification Number) in India.",
      legalJargonSimplified: "You fill a two-part form: Part A generates a Temporary Reference Number (TRN), and Part B captures all your business details, documents, and bank information.",
      requiredDocuments: ["All documents from Step 1"],
      prerequisites: ["All documents gathered (Step 1)"],
      officialUrl: "https://www.gst.gov.in/",
      estimatedDays: "3-7 working days",
      tips: "Verify your application with Aadhaar OTP for fastest processing. Applications verified via Aadhaar are often approved within 3 days.",
      commonMistakes: ["Not completing Part B within 15 days of Part A submission", "Uploading blurry document scans"],
      canBeDoneOnline: true,
      subTasks: [
        "Visit gst.gov.in and select 'Register Now'",
        "Complete Part A with PAN, email, and mobile",
        "Verify via email and mobile OTP to get TRN",
        "Complete Part B with full business details",
        "Upload all documents and submit"
      ]
    }
  ]
};

function getMockQuestions(goal) {
  const goalLower = goal.toLowerCase();
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
  if (goalLower.includes('fssai') || goalLower.includes('food')) {
    return [
      ...defaultQuestions,
      {
        id: "q_fssai_type",
        question: "What is your approximate annual food business turnover?",
        type: "single-choice",
        options: ["Up to Rs. 12 lakh", "Rs. 12 lakh - Rs. 20 crore", "Above Rs. 20 crore"]
      }
    ];
  }
  if (goalLower.includes('gst')) {
    return [
      ...defaultQuestions,
      {
        id: "q_gst_type",
        question: "What type of business entity are you registering?",
        type: "single-choice",
        options: ["Sole Proprietorship", "Partnership", "Private Limited Company", "LLP", "Other"]
      }
    ];
  }

  return defaultQuestions;
}

function getMockWorkflow(goal, answers) {
  const goalLower = goal.toLowerCase();
  if (goalLower.includes('aadhaar')) return mockAadhaarWorkflow;
  if (goalLower.includes('pan')) return mockPANWorkflow;
  if (goalLower.includes('driving') || goalLower.includes('licence') || goalLower.includes('license')) return mockDLWorkflow;
  if (goalLower.includes('fssai') || goalLower.includes('food')) return mockFSSAIWorkflow;
  if (goalLower.includes('gst')) return mockGSTWorkflow;

  // Generic fallback
  return {
    goal: goal,
    complexity: "Standard",
    summary: "Based on your inputs, here is a general step-by-step workflow for your request.",
    totalEstimatedTime: "2-4 weeks",
    totalEstimatedCost: "Varies",
    steps: [
      {
        id: "step_1",
        title: "Gather Initial Documents",
        description: "Collect your basic identity and address proofs required for this process.",
        governmentDepartment: "Relevant Authority",
        estimatedFee: "Varies",
        whyThisStepIsRequired: "Most government processes require identity and address verification as a first step.",
        legalJargonSimplified: "You will need documents that prove who you are and where you live. Common accepted documents include Aadhaar, PAN, Passport, Voter ID, and utility bills.",
        requiredDocuments: ["Identity Proof (Aadhaar/PAN/Passport/Voter ID)", "Address Proof (Utility Bill/Bank Statement/Aadhaar)"],
        prerequisites: [],
        officialUrl: "",
        estimatedDays: "1 day",
        tips: "Always carry originals along with self-attested photocopies. Keep digital scans on your phone as backup.",
        commonMistakes: ["Not carrying original documents", "Photocopies not self-attested"],
        canBeDoneOnline: false,
        subTasks: [
          "List all required documents",
          "Collect originals and make photocopies",
          "Self-attest all photocopies"
        ]
      },
      {
        id: "step_2",
        title: "Submit Application",
        description: "Submit the relevant application form either online or at the local government office.",
        governmentDepartment: "Relevant Authority",
        estimatedFee: "Applicable fees",
        whyThisStepIsRequired: "Formal application submission initiates your request in the government's processing system.",
        legalJargonSimplified: "You fill out an application form with your details and submit it along with your documents. You'll receive an acknowledgment or tracking number.",
        requiredDocuments: ["All documents from Step 1", "Completed application form"],
        prerequisites: ["Documents gathered (Step 1)"],
        officialUrl: "",
        estimatedDays: "1-2 weeks",
        tips: "Ask for a receipt or tracking number so you can check the status of your application later.",
        commonMistakes: ["Submitting incomplete forms", "Not collecting the acknowledgment receipt"],
        canBeDoneOnline: true,
        subTasks: [
          "Fill the application form completely",
          "Attach all required documents",
          "Pay applicable fees",
          "Collect acknowledgment/tracking number"
        ]
      }
    ]
  };
}

function getMockHelperAnswer(question, context) {
  if (context && context.stepTitle) {
    return `Regarding "${context.stepTitle}": ${question}\n\nThis is a mock response from LynQbot. When the Groq API key is configured, you'll receive detailed, AI-generated answers specific to your question about this step. For now, here's general guidance:\n\n• Always carry original documents along with photocopies\n• Check the official government portal for the most up-to-date requirements\n• Visit during off-peak hours (early morning) for shorter queues\n• Keep digital copies of all submissions on your phone`;
  }
  return `You asked: "${question}"\n\nThis is a mock response from LynQbot. When the Groq API key is configured, I'll provide detailed, accurate answers about Indian government processes. For now, here's general advice:\n\n• Most government services are now available online through respective portals\n• Always verify requirements on the official website before visiting any office\n• Keep your Aadhaar and PAN handy — they're required for almost all processes\n• You can track most applications online using the acknowledgment/reference number`;
}

function getMockDraft(templateType, intakeAnswers, goal) {
  return `# Draft: ${templateType}\n\n**For:** ${goal || 'Government Process'}\n\n---\n\nThis is a mock draft document generated because the Groq API is not configured. When a valid API key is added to \`.env\`, this will generate a properly formatted draft based on your specific details.\n\n**Applicant Details:**\n${intakeAnswers ? Object.entries(intakeAnswers).map(([k, v]) => `- **${k}:** ${v}`).join('\n') : '- No details provided yet'}\n\n---\n\n*This document is auto-generated and should be reviewed before submission.*`;
}

function getMockDocumentGuide(documentName) {
  return {
    steps: [
      `Visit the official portal or your nearest government office for ${documentName}.`,
      `Fill out the application form with your details.`,
      `Submit the form along with required supporting documents and pay any applicable fees.`
    ],
    link: "https://www.india.gov.in/"
  };
}

module.exports = {
  getMockQuestions,
  getMockWorkflow,
  getMockHelperAnswer,
  getMockDraft,
  getMockDocumentGuide
};
