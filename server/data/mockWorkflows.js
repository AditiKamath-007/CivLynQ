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
  title: "Apply for a New Aadhaar Card",
  description: "Step-by-step guide to applying for a new Aadhaar card as a Resident Indian.",
  steps: [
    {
      id: "step_1",
      title: "Locate Enrollment Center",
      description: "Find the nearest Aadhaar enrollment center using the UIDAI portal.",
      status: "pending",
      agency: "UIDAI",
      estimatedTime: "10 mins",
      cost: "Free",
      requiredDocuments: [],
      tips: ["Check if the center requires prior online booking or accepts walk-ins."],
      links: [{ text: "UIDAI Portal - Locate Center", url: "https://appointments.uidai.gov.in/easearch.aspx" }],
      templates: []
    },
    {
      id: "step_2",
      title: "Fill Enrollment Form",
      description: "Download and fill the Aadhaar enrollment form before visiting.",
      status: "pending",
      agency: "UIDAI",
      estimatedTime: "15 mins",
      cost: "Free",
      requiredDocuments: [],
      tips: ["Use capital letters to fill the form.", "Ensure mobile number is correctly entered as it will be linked."],
      links: [{ text: "Download Form", url: "https://uidai.gov.in/images/aadhaar_enrolment_correction_form_version_2.1.pdf" }],
      templates: []
    },
    {
      id: "step_3",
      title: "Visit Center with Documents",
      description: "Visit the center, submit the form with Proof of Identity (PoI) and Proof of Address (PoA). Provide biometrics.",
      status: "pending",
      agency: "UIDAI",
      estimatedTime: "1-2 hours",
      cost: "Free for new enrollment",
      requiredDocuments: ["Proof of Identity (e.g., PAN, Passport)", "Proof of Address (e.g., Utility Bill, Passport)"],
      tips: ["Take original documents; they will be scanned and returned.", "Keep the acknowledgment slip safe to track status."],
      links: [],
      templates: []
    }
  ]
};

const mockPANWorkflow = {
  title: "Apply for a New PAN Card",
  description: "Step-by-step guide to applying for a PAN card online (Form 49A).",
  steps: [
    {
      id: "step_1",
      title: "Submit Online Application",
      description: "Fill Form 49A on the NSDL or UTIITSL portal.",
      status: "pending",
      agency: "Income Tax Department / NSDL",
      estimatedTime: "30 mins",
      cost: "Rs. 107 (approx)",
      requiredDocuments: ["Aadhaar Card (for e-KYC)"],
      tips: ["Using Aadhaar e-KYC makes the process completely paperless and faster."],
      links: [{ text: "NSDL PAN Portal", url: "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html" }],
      templates: []
    },
    {
      id: "step_2",
      title: "Payment and Authentication",
      description: "Pay the fee online and authenticate using Aadhaar OTP.",
      status: "pending",
      agency: "NSDL",
      estimatedTime: "10 mins",
      cost: "Included in Step 1",
      requiredDocuments: [],
      tips: ["Ensure your Aadhaar is linked to your active mobile number to receive the OTP."],
      links: [],
      templates: []
    },
    {
      id: "step_3",
      title: "Receive e-PAN and Physical PAN",
      description: "e-PAN will be emailed in a few days. Physical card will be dispatched by post.",
      status: "pending",
      agency: "Income Tax Department",
      estimatedTime: "1-2 weeks",
      cost: "Free",
      requiredDocuments: [],
      tips: ["You can use the e-PAN immediately for all legal purposes."],
      links: [],
      templates: []
    }
  ]
};

const mockDLWorkflow = {
  title: "Apply for a Driving Licence",
  description: "Step-by-step guide to applying for a Driving Licence in India via Parivahan Sarathi.",
  steps: [
    {
      id: "step_1",
      title: "Apply for Learner's Licence (LL)",
      description: "Submit LL application online and take the computer-based test.",
      status: "pending",
      agency: "RTO / Parivahan",
      estimatedTime: "1 week",
      cost: "Rs. 200 (approx)",
      requiredDocuments: ["Age Proof", "Address Proof", "Passport Size Photos"],
      tips: ["Aadhaar authentication lets you take the LL test from home in some states."],
      links: [{ text: "Parivahan Sarathi", url: "https://sarathi.parivahan.gov.in/" }],
      templates: []
    },
    {
      id: "step_2",
      title: "Apply for Permanent DL",
      description: "After 30 days of getting LL, apply for permanent DL.",
      status: "pending",
      agency: "RTO",
      estimatedTime: "30-180 days",
      cost: "Rs. 200 (approx)",
      requiredDocuments: ["Learner's Licence"],
      tips: ["You must apply within 6 months of LL issuance."],
      links: [],
      templates: []
    },
    {
      id: "step_3",
      title: "Take Driving Test",
      description: "Visit the RTO with your vehicle for the practical driving test.",
      status: "pending",
      agency: "RTO",
      estimatedTime: "1 day",
      cost: "Free",
      requiredDocuments: ["Vehicle Documents (RC, Insurance, PUC)"],
      tips: ["Ensure the vehicle used for the test is of the same class you applied for."],
      links: [],
      templates: []
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
  
  return defaultQuestions;
}

function getMockWorkflow(goal, answers) {
  const goalLower = goal.toLowerCase();
  if (goalLower.includes('aadhaar')) return mockAadhaarWorkflow;
  if (goalLower.includes('pan')) return mockPANWorkflow;
  if (goalLower.includes('driving') || goalLower.includes('licence') || goalLower.includes('license')) return mockDLWorkflow;
  
  // Generic fallback workflow
  return {
    title: "Guide: " + goal,
    description: "Based on your inputs, here is a general workflow for your request.",
    steps: [
      {
        id: "step_1",
        title: "Gather Initial Documents",
        description: "Collect your basic identity and address proofs.",
        status: "pending",
        agency: "Relevant Authority",
        estimatedTime: "1 day",
        cost: "Varies",
        requiredDocuments: ["Identity Proof", "Address Proof"],
        tips: ["Always carry originals along with self-attested copies."],
        links: [],
        templates: [{ type: "Self-Declaration", name: "Generic Affidavit" }]
      },
      {
        id: "step_2",
        title: "Submit Application",
        description: "Submit the relevant form either online or at the local office.",
        status: "pending",
        agency: "Relevant Authority",
        estimatedTime: "1-2 weeks",
        cost: "Applicable fees",
        requiredDocuments: [],
        tips: ["Ask for a receipt or tracking number."],
        links: [],
        templates: []
      }
    ]
  };
}

module.exports = {
  getMockQuestions,
  getMockWorkflow
};
