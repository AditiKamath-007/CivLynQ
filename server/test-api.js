const profile = {
  age: '27',
  gender: 'Male',
  occupation: 'Student',
  category: 'General',
  income: 'Below ₹1 Lakh'
};

const schemesData = [
  { id: '1', name: 'Scheme 1', eligibility: ['Test'] }
];

async function run() {
  const res = await fetch('http://localhost:3001/api/check-eligibility', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, schemesData })
  });
  
  if (!res.ok) {
    console.log("Status:", res.status);
    console.log("Text:", await res.text());
  } else {
    const data = await res.json();
    console.log("Data:", data);
  }
}

run();
