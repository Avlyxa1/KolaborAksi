import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'primary' | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) {
  let baseColorClass = '';

  switch (variant) {
    case 'success': // Hijau - terverifikasi/selesai
      baseColorClass = 'bg-green-100 text-green-800 border-green-200';
      break;
    case 'warning': // Kuning - menunggu/draft
      baseColorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
      break;
    case 'danger': // Merah - ditolak/batal
      baseColorClass = 'bg-red-100 text-red-800 border-red-200';
      break;
    case 'primary': // Biru - aktif/published
      baseColorClass = 'bg-primary-light text-primary-hover border-blue-200';
      break;
    default:
      baseColorClass = 'bg-gray-100 text-text-secondary border-gray-200';
      break;
  }

  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium border ${baseColorClass} ${className}`}
    >
      {children}
    </span>
  );
}
