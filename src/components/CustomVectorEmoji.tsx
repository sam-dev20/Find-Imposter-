import React from 'react';

export type CustomEmojiType =
  | 'spy'
  | 'detective'
  | 'smirk'
  | 'thinking'
  | 'happy'
  | 'shocked'
  | 'wink'
  | 'cool'
  | 'innocent'
  | 'mysterious'
  | 'alarm'
  | 'target'
  | 'vote_box'
  | 'trophy'
  | 'magnifier'
  | 'question'
  | 'lock';

interface CustomVectorEmojiProps {
  type: CustomEmojiType;
  size?: number;
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export const CustomVectorEmoji: React.FC<CustomVectorEmojiProps> = ({
  type,
  size = 32,
  className = '',
  primaryColor = 'currentColor',
  secondaryColor = '#60A5FA',
}) => {
  const viewBox = "0 0 48 48";

  switch (type) {
    case 'spy':
      return (
        <svg
          width={size}
          height={size}
          viewBox={viewBox}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Hat */}
          <path d="M6 18C10 18 14 17 24 17C34 17 38 18 42 18C44 18 44 16 41 15C37 13.5 35 7 24 7C13 7 11 13.5 7 15C4 16 4 18 6 18Z" fill="#1F2937" stroke="#9CA3AF" strokeWidth="1.5" />
          <path d="M12 17C13 11 17 9 24 9C31 9 35 11 36 17" fill="#374151" />
          {/* Hat Ribbon */}
          <path d="M11.5 16C16 14.8 32 14.8 36.5 16L36 17.5C31 16.5 17 16.5 12 17.5L11.5 16Z" fill="#EF4444" />
          {/* Face */}
          <path d="M12 20C12 30 17 39 24 39C31 39 36 30 36 20H12Z" fill="#FBBF24" />
          {/* Sunglasses */}
          <path d="M13 22H22L21 28C20.5 30 14.5 30 14 28L13 22Z" fill="#111827" stroke="#4B5563" strokeWidth="1" />
          <path d="M26 22H35L34 28C33.5 30 27.5 30 27 28L26 22Z" fill="#111827" stroke="#4B5563" strokeWidth="1" />
          <path d="M22 24H26" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
          {/* Reflection in shades */}
          <path d="M15 24L18 27" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M28 24L31 27" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
          {/* Trench Coat Collar */}
          <path d="M14 36L10 45H38L34 36L24 39L14 36Z" fill="#374151" stroke="#4B5563" strokeWidth="1.5" />
          {/* Sneaky smirk */}
          <path d="M22 34C24 35 27 34 29 32" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'detective':
      return (
        <svg
          width={size}
          height={size}
          viewBox={viewBox}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Magnifying Glass & Detective Badge */}
          <circle cx="21" cy="21" r="14" fill="#3B82F6" fillOpacity="0.2" stroke="#60A5FA" strokeWidth="3" />
          <path d="M31 31L42 42" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
          <path d="M31 31L42 42" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          {/* Eye inside lens */}
          <ellipse cx="21" cy="21" rx="8" ry="5.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="21" cy="21" r="3.5" fill="#0284C7" />
          <circle cx="22.5" cy="19.5" r="1.2" fill="#FFFFFF" />
        </svg>
      );

    case 'smirk':
      return (
        <svg width={size} height={size} viewBox={viewBox} fill="none" className={className}>
          <circle cx="24" cy="24" r="20" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
          {/* Sly eyes */}
          <path d="M14 19C17 17 20 18 20 19" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="17" cy="21" r="2.2" fill="#78350F" />
          <path d="M28 19C31 17 34 18 34 19" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="31" cy="21" r="2.2" fill="#78350F" />
          {/* Eyebrow raised */}
          <path d="M13 14C17 13 20 15 20 16" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
          <path d="M28 16C31 13 35 13 36 14" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
          {/* Asymmetrical smirk */}
          <path d="M17 30C21 31 29 33 32 27" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'thinking':
      return (
        <svg width={size} height={size} viewBox={viewBox} fill="none" className={className}>
          <circle cx="24" cy="22" r="18" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
          {/* Looking up eyes */}
          <circle cx="18" cy="17" r="2.5" fill="#78350F" />
          <circle cx="30" cy="17" r="2.5" fill="#78350F" />
          {/* Furrowed brows */}
          <path d="M14 13L21 15" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
          <path d="M34 13L27 15" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
          {/* Pursed mouth */}
          <path d="M19 28C23 27 27 28 29 27" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
          {/* Hand on chin */}
          <path d="M22 36C26 36 31 35 34 32C36 30 38 27 39 30C40 33 36 39 30 41C25 43 19 41 18 38L22 36Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
        </svg>
      );

    case 'happy':
      return (
        <svg width={size} height={size} viewBox={viewBox} fill="none" className={className}>
          <circle cx="24" cy="24" r="20" fill="#10B981" stroke="#059669" strokeWidth="2" />
          {/* Happy curve eyes */}
          <path d="M14 20C15 16 20 16 21 20" stroke="#064E3B" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M27 20C28 16 33 16 34 20" stroke="#064E3B" strokeWidth="2.5" strokeLinecap="round" />
          {/* Broad smile */}
          <path d="M15 27C17 34 31 34 33 27" stroke="#064E3B" strokeWidth="2.5" strokeLinecap="round" fill="#ECFDF5" />
        </svg>
      );

    case 'shocked':
      return (
        <svg width={size} height={size} viewBox={viewBox} fill="none" className={className}>
          <circle cx="24" cy="24" r="20" fill="#F43F5E" stroke="#BE123C" strokeWidth="2" />
          {/* Wide round eyes */}
          <circle cx="16" cy="19" r="4.5" fill="#FFFFFF" />
          <circle cx="16" cy="19" r="2" fill="#881337" />
          <circle cx="32" cy="19" r="4.5" fill="#FFFFFF" />
          <circle cx="32" cy="19" r="2" fill="#881337" />
          {/* High eyebrows */}
          <path d="M12 11C16 9 20 11 20 12" stroke="#881337" strokeWidth="2" strokeLinecap="round" />
          <path d="M28 12C28 11 32 9 36 11" stroke="#881337" strokeWidth="2" strokeLinecap="round" />
          {/* Big O mouth */}
          <ellipse cx="24" cy="32" rx="5" ry="7" fill="#881337" stroke="#FFE4E6" strokeWidth="1.5" />
        </svg>
      );

    case 'wink':
      return (
        <svg width={size} height={size} viewBox={viewBox} fill="none" className={className}>
          <circle cx="24" cy="24" r="20" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="2" />
          {/* One open eye, one winking */}
          <circle cx="17" cy="20" r="2.5" fill="#2E1065" />
          <path d="M28 20L34 20" stroke="#2E1065" strokeWidth="3" strokeLinecap="round" />
          {/* Smile with cheek */}
          <path d="M17 28C21 33 27 33 31 28" stroke="#2E1065" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'cool':
      return (
        <svg width={size} height={size} viewBox={viewBox} fill="none" className={className}>
          <circle cx="24" cy="24" r="20" fill="#0EA5E9" stroke="#0284C7" strokeWidth="2" />
          {/* Black shades */}
          <path d="M10 18H38V23C38 27 33 28 30 27L24 23L18 27C15 28 10 27 10 23V18Z" fill="#0F172A" />
          <path d="M12 20L20 25" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M28 20L36 25" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
          {/* Confident smile */}
          <path d="M18 31C22 34 26 34 30 31" stroke="#082F49" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'innocent':
      return (
        <svg width={size} height={size} viewBox={viewBox} fill="none" className={className}>
          {/* Halo */}
          <ellipse cx="24" cy="7" rx="14" ry="4" stroke="#FDE047" strokeWidth="2.5" fill="none" />
          <circle cx="24" cy="26" r="18" fill="#EC4899" stroke="#BE185D" strokeWidth="2" />
          {/* Big innocent eyes */}
          <circle cx="18" cy="23" r="3.5" fill="#500724" />
          <circle cx="19" cy="22" r="1" fill="#FFFFFF" />
          <circle cx="30" cy="23" r="3.5" fill="#500724" />
          <circle cx="31" cy="22" r="1" fill="#FFFFFF" />
          {/* Soft small smile */}
          <path d="M20 31C22 33 26 33 28 31" stroke="#500724" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'mysterious':
      return (
        <svg width={size} height={size} viewBox={viewBox} fill="none" className={className}>
          <circle cx="24" cy="24" r="20" fill="#334155" stroke="#64748B" strokeWidth="2" />
          {/* Glowing slit eyes */}
          <path d="M12 21C16 19 20 22 20 22C20 22 16 24 12 21Z" fill="#38BDF8" />
          <path d="M36 21C32 19 28 22 28 22C28 22 32 24 36 21Z" fill="#38BDF8" />
          {/* Question mark forehead glow */}
          <path d="M22 10C22 8 26 8 26 10C26 12 24 12 24 14" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
          <circle cx="24" cy="16.5" r="1" fill="#FACC15" />
          {/* Calm line */}
          <path d="M20 32H28" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'question':
      return (
        <svg width={size} height={size} viewBox={viewBox} fill="none" className={className}>
          <rect x="4" y="4" width="40" height="40" rx="12" fill="#1E293B" stroke="#60A5FA" strokeWidth="2.5" />
          <path d="M18 17C18 13.5 21 11 24 11C27.5 11 30.5 13.5 30.5 17C30.5 20.5 27 22.5 24 24.5V28" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="24" cy="34" r="2.5" fill="#38BDF8" />
        </svg>
      );

    case 'target':
      return (
        <svg width={size} height={size} viewBox={viewBox} fill="none" className={className}>
          <circle cx="24" cy="24" r="20" stroke="#EF4444" strokeWidth="2.5" fill="#FEF2F2" fillOpacity="0.1" />
          <circle cx="24" cy="24" r="13" stroke="#EF4444" strokeWidth="2" />
          <circle cx="24" cy="24" r="6" fill="#EF4444" />
          <path d="M24 2V8M24 40V46M2 24H8M40 24H46" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'vote_box':
      return (
        <svg width={size} height={size} viewBox={viewBox} fill="none" className={className}>
          {/* Ballot Box */}
          <rect x="8" y="16" width="32" height="26" rx="4" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" />
          <path d="M6 16H42" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
          <path d="M17 16H31" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          {/* Ballot going in */}
          <path d="M18 6H30L32 16H16L18 6Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
          <path d="M21 10L23 12L27 8" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="24" cy="29" r="4" fill="#3B82F6" />
        </svg>
      );

    case 'alarm':
      return (
        <svg width={size} height={size} viewBox={viewBox} fill="none" className={className}>
          <path d="M24 8V12M12 14L9 11M36 14L39 11" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M12 36C12 36 14 20 24 20C34 20 36 36 36 36H12Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
          <rect x="10" y="36" width="28" height="4" rx="2" fill="#991B1B" />
          <circle cx="24" cy="42" r="2" fill="#7F1D1D" />
        </svg>
      );

    case 'trophy':
      return (
        <svg width={size} height={size} viewBox={viewBox} fill="none" className={className}>
          <path d="M14 8H34V20C34 26 29.5 30 24 30C18.5 30 14 26 14 20V8Z" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
          <path d="M14 12H8C6.5 12 5 13.5 5 15C5 18 8 20 14 20" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
          <path d="M34 12H40C41.5 12 43 13.5 43 15C43 18 40 20 34 20" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
          <path d="M24 30V38M16 42H32M18 38H30" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="24" cy="18" r="4" fill="#FEF3C7" />
        </svg>
      );

    case 'magnifier':
      return (
        <svg width={size} height={size} viewBox={viewBox} fill="none" className={className}>
          <circle cx="20" cy="20" r="12" stroke="#38BDF8" strokeWidth="3" fill="#0284C7" fillOpacity="0.2" />
          <path d="M29 29L40 40" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
          <circle cx="20" cy="20" r="6" stroke="#BAE6FD" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      );

    case 'lock':
      return (
        <svg width={size} height={size} viewBox={viewBox} fill="none" className={className}>
          <rect x="10" y="20" width="28" height="22" rx="4" fill="#334155" stroke="#94A3B8" strokeWidth="2" />
          <path d="M16 20V14C16 9.5 19.5 6 24 6C28.5 6 32 9.5 32 14V20" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          <circle cx="24" cy="30" r="2.5" fill="#F8FAFC" />
          <path d="M24 32.5V36" stroke="#F8FAFC" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    default:
      return null;
  }
};

export const AVATAR_TYPES: CustomEmojiType[] = [
  'spy',
  'detective',
  'smirk',
  'thinking',
  'happy',
  'shocked',
  'wink',
  'cool',
  'innocent',
  'mysterious',
];
