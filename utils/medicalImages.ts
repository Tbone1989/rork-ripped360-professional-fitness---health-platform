import { MedicineInfo, SupplementInfo } from '@/types/medical';

const vialUrl = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=900&auto=format&fit=crop';
const syringeUrl = 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=900&auto=format&fit=crop';
const pillBlisterUrl = 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&w=900&auto=format&fit=crop';
const capsulesUrl = 'https://images.unsplash.com/photo-1535747790212-30c585ab4863?q=80&w=900&auto=format&fit=crop';
const tabletsUrl = 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=900&auto=format&fit=crop';
const softgelsUrl = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85f?q=80&w=900&auto=format&fit=crop';
const powderScoopUrl = 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=900&auto=format&fit=crop';
const creatineScoopUrl = 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=900&auto=format&fit=crop';
const bottleDropperUrl = 'https://images.unsplash.com/photo-1601841162542-8341f9b31fbe?q=80&w=900&auto=format&fit=crop';

// Liquid peptides common image (vial + syringe). Only used for liquid/injectable peptides.
const liquidPeptideUrl = 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/s5bpf20odmg1xc4s0f6gk';

export const herbsImageUrl = 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/0dv48um5g9m8eayocblgx';
export function getImageForHerb(): string { return herbsImageUrl; }
export const vitaminsImageUrl = 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/4fstoxmxbl66beltouga5';

export function getImageForSupplement(item: SupplementInfo): string {
  const name = (item.name ?? '').toLowerCase();
  const category = (item.category ?? '').toLowerCase();

  // Peptides as supplements: only map liquid/injectable to liquidPeptideUrl
  const looksLikePeptide = category.includes('peptide') || name.includes('peptide') || name.includes('semaglutide') || name.includes('tirzepatide') || name.includes('bpc') || name.includes('cjc') || name.includes('ipamorelin') || name.includes('tb-500');
  const isPillForm = category.includes('tablet') || category.includes('pill') || category.includes('capsule') || name.includes('tablet') || name.includes('pill') || name.includes('capsule') || name.includes('oral');
  const isLiquidForm = category.includes('liquid') || category.includes('inject') || category.includes('injection') || category.includes('subq') || category.includes('vial') || name.includes('liquid') || name.includes('inject') || name.includes('injection') || name.includes('subq') || name.includes('vial');

  if (looksLikePeptide && isLiquidForm && !isPillForm) {
    return liquidPeptideUrl;
  }

  if (name.includes('creatine')) return creatineScoopUrl;
  if (category.includes('protein') || name.includes('whey')) return powderScoopUrl;
  if (name.includes('fish oil') || name.includes('omega') || category.includes('oil')) return softgelsUrl;
  if ((category.includes('vitamin') || name.includes('vitamin')) && !category.includes('mineral') && !name.includes('mineral')) return vitaminsImageUrl;
  if (category.includes('capsule') || name.includes('capsule')) return capsulesUrl;
  if (category.includes('tablet') || name.includes('pill')) return pillBlisterUrl;
  if (category.includes('liquid') || name.includes('drops') || name.includes('tincture')) return bottleDropperUrl;
  return capsulesUrl;
}

export function getImageForMedicine(item: MedicineInfo): string {
  const name = (item.name ?? '').toLowerCase();
  const category = (item.category ?? '').toLowerCase();

  const looksLikePeptide = category.includes('glp') || category.includes('gip') || category.includes('peptide') || name.includes('cjc') || name.includes('ipamorelin') || name.includes('bpc') || name.includes('tb-500') || name.includes('semaglutide') || name.includes('tirzepatide');
  const isPillForm = category.includes('tablet') || category.includes('pill') || category.includes('capsule') || name.includes('tablet') || name.includes('pill') || name.includes('capsule') || name.includes('oral');

  if (looksLikePeptide) {
    if (isPillForm) {
      return pillBlisterUrl;
    }
    // default to liquid peptide image when not explicitly a pill form
    return liquidPeptideUrl;
  }

  if (category.includes('hormone') || name.includes('testosterone') || name.includes('estradiol') || name.includes('progesterone')) {
    return syringeUrl;
  }
  if (category.includes('patch')) return bottleDropperUrl;
  if (category.includes('tablet') || name.includes('tablet') || name.includes('pill')) return pillBlisterUrl;
  return vialUrl;
}
