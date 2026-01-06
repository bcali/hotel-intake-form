interface SourceIconProps {
  source: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const sourceConfig = {
  google: {
    name: 'Google',
    color: 'bg-blue-600',
    textColor: 'text-white',
    icon: 'G',
  },
  tripadvisor: {
    name: 'TripAdvisor',
    color: 'bg-green-600',
    textColor: 'text-white',
    icon: 'TA',
  },
  booking: {
    name: 'Booking.com',
    color: 'bg-blue-700',
    textColor: 'text-white',
    icon: 'B',
  },
  agoda: {
    name: 'Agoda',
    color: 'bg-red-600',
    textColor: 'text-white',
    icon: 'A',
  },
  social: {
    name: 'Social',
    color: 'bg-purple-600',
    textColor: 'text-white',
    icon: 'S',
  },
  instagram: {
    name: 'Instagram',
    color: 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500',
    textColor: 'text-white',
    icon: 'IG',
  },
  facebook: {
    name: 'Facebook',
    color: 'bg-blue-600',
    textColor: 'text-white',
    icon: 'FB',
  },
  tiktok: {
    name: 'TikTok',
    color: 'bg-black',
    textColor: 'text-white',
    icon: 'TT',
  },
};

const sizeClasses = {
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
};

export function SourceIcon({ source, size = 'sm', showLabel = false }: SourceIconProps) {
  const config = sourceConfig[source as keyof typeof sourceConfig] || {
    name: source,
    color: 'bg-gray-500',
    textColor: 'text-white',
    icon: source.charAt(0).toUpperCase(),
  };

  if (showLabel) {
    return (
      <div className="flex items-center gap-2">
        <div
          className={`${sizeClasses[size]} ${config.color} ${config.textColor} rounded-md font-black flex items-center justify-center flex-shrink-0 shadow-sm`}
          title={config.name}
        >
          {config.icon}
        </div>
        <span className="text-gray-700 font-bold text-sm tracking-tight">{config.name}</span>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${config.color} ${config.textColor} rounded-md font-black flex items-center justify-center flex-shrink-0 shadow-sm`}
      title={config.name}
    >
      {config.icon}
    </div>
  );
}

export function SourceBadge({ source }: { source: string }) {
  const config = sourceConfig[source as keyof typeof sourceConfig] || {
    name: source,
    color: 'bg-gray-100',
    textColor: 'text-gray-700',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${config.color} ${config.textColor}`}>
      {config.name}
    </span>
  );
}



