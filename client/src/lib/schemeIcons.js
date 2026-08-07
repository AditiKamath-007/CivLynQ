import { Fingerprint, CreditCard, Vote, Building2, FileText, GraduationCap, Briefcase, Home as HomeIcon, Heart, Wheat, Car, Receipt, Shield, Users, Factory, BookOpen } from 'lucide-react';

// Map scheme name (case-insensitive substring match) to an icon
export function getSchemeIcon(schemeName) {
  const name = schemeName.toLowerCase();
  if (name.includes('aadhaar')) return Fingerprint;
  if (name.includes('pan')) return CreditCard;
  if (name.includes('voter') || name.includes('election')) return Vote;
  if (name.includes('gst') || name.includes('tax')) return Receipt;
  if (name.includes('driving') || name.includes('license')) return Car;
  if (name.includes('ration')) return Wheat;
  if (name.includes('passport')) return FileText;
  if (name.includes('company') || name.includes('mca') || name.includes('business')) return Building2;
  if (name.includes('shop') || name.includes('establishment')) return Factory;
  if (name.includes('ayushman') || name.includes('health') || name.includes('medic')) return Heart;
  if (name.includes('scholarship') || name.includes('student') || name.includes('education')) return GraduationCap;
  if (name.includes('loan') || name.includes('mudra') || name.includes('stand-up')) return Briefcase;
  if (name.includes('house') || name.includes('awas') || name.includes('home')) return HomeIcon;
  if (name.includes('insurance') || name.includes('bima') || name.includes('suraksha')) return Shield;
  if (name.includes('pension') || name.includes('apy')) return Users;
  if (name.includes('sukanya') || name.includes('daughter') || name.includes('girl')) return BookOpen;
  return FileText; // generic fallback
}
