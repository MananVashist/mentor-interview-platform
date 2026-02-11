// components/AppIcons.tsx
import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export const FeedbackIcon = () => (
  <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
    <Circle cx={24} cy={24} r={20} fill="#10b981" opacity={0.1} />
    <Path d="M14 24l6 6 14-14" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <Rect x={12} y={32} width={24} height={4} rx={2} fill="#10b981" opacity={0.5} />
  </Svg>
);

export const VideoIcon = () => (
  <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
    <Circle cx={24} cy={24} r={20} fill="#18a7a7" opacity={0.1} />
    <Path d="M34 24l-14-9v18l14-9z" fill="#18a7a7" />
    <Rect x={14} y={12} width={4} height={24} rx={1} fill="#18a7a7" opacity={0.3} />
  </Svg>
);

export const StarIcon = () => (
  <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
    <Circle cx={24} cy={24} r={20} fill="#f59e0b" opacity={0.1} />
    <Path d="M24 8l4.5 13.5H42L30 32l4.5 14L24 36l-10.5 10L18 32 6 21.5h13.5L24 8z" fill="#f59e0b" />
  </Svg>
);

export const BronzeBadge = () => (
  <Svg width={56} height={56} viewBox="0 0 56 56" fill="none">
    <Circle cx={28} cy={28} r={27} fill="#8B4513" opacity={0.2} />
    <Circle cx={28} cy={28} r={24} fill="#CD7F32" />
    <Circle cx={28} cy={28} r={20} fill="#B87333" />
    <Circle cx={28} cy={28} r={16} fill="#D4A574" opacity={0.4} />
    <Path d="M28 14l2.5 7.5h8l-6.5 5 2.5 7.5-6.5-5-6.5 5 2.5-7.5-6.5-5h8L28 14z" fill="#FFFFFF" opacity={0.9} />
  </Svg>
);

export const SilverBadge = () => (
  <Svg width={56} height={56} viewBox="0 0 56 56" fill="none">
    <Circle cx={28} cy={28} r={27} fill="#808080" opacity={0.2} />
    <Circle cx={28} cy={28} r={24} fill="#C0C0C0" />
    <Circle cx={28} cy={28} r={20} fill="#D3D3D3" />
    <Circle cx={28} cy={28} r={16} fill="#E8E8E8" opacity={0.5} />
    <Path d="M28 14l2.5 7.5h8l-6.5 5 2.5 7.5-6.5-5-6.5 5 2.5-7.5-6.5-5h8L28 14z" fill="#FFFFFF" opacity={0.95} />
  </Svg>
);

export const GoldBadge = () => (
  <Svg width={56} height={56} viewBox="0 0 56 56" fill="none">
    <Circle cx={28} cy={28} r={27} fill="#B8860B" opacity={0.3} />
    <Circle cx={28} cy={28} r={24} fill="#FFD700" />
    <Circle cx={28} cy={28} r={20} fill="#FFC700" />
    <Circle cx={28} cy={28} r={16} fill="#FFED4E" opacity={0.5} />
    <Path d="M28 14l2.5 7.5h8l-6.5 5 2.5 7.5-6.5-5-6.5 5 2.5-7.5-6.5-5h8L28 14z" fill="#FFFFFF" opacity={0.95} />
  </Svg>
);