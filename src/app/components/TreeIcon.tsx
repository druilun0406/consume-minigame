type TreeState = "unanswered" | "correct" | "wrong";

interface TreeIconProps {
  state: TreeState;
  className?: string;
}

export function TreeIcon({ state, className = "" }: TreeIconProps) {
  if (state === "unanswered") {
    return (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Gray minimalist tree outline */}
        <path
          d="M24 6 L20 18 L16 18 L24 4 L32 18 L28 18 L24 6 Z"
          stroke="#9CA3AF"
          strokeWidth="2"
          fill="none"
          strokeLinejoin="round"
        />
        <path
          d="M22 18 L18 28 L14 28 L24 14 L34 28 L30 28 L26 18"
          stroke="#9CA3AF"
          strokeWidth="2"
          fill="none"
          strokeLinejoin="round"
        />
        <rect
          x="21"
          y="28"
          width="6"
          height="14"
          stroke="#9CA3AF"
          strokeWidth="2"
          fill="none"
          rx="1"
        />
      </svg>
    );
  }

  if (state === "correct") {
    return (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Full lush green tree with many leaves */}
        {/* Top foliage layer */}
        <circle cx="24" cy="12" r="7" fill="#10B981" />
        <circle cx="19" cy="14" r="5" fill="#059669" />
        <circle cx="29" cy="14" r="5" fill="#059669" />
        
        {/* Middle foliage layer */}
        <circle cx="24" cy="20" r="8" fill="#22C55E" />
        <circle cx="17" cy="22" r="6" fill="#10B981" />
        <circle cx="31" cy="22" r="6" fill="#10B981" />
        
        {/* Bottom foliage layer */}
        <circle cx="24" cy="28" r="7" fill="#16A34A" />
        <circle cx="19" cy="26" r="5" fill="#059669" />
        <circle cx="29" cy="26" r="5" fill="#059669" />
        
        {/* Trunk */}
        <rect x="21" y="28" width="6" height="14" fill="#92400E" rx="1" />
      </svg>
    );
  }

  // state === "wrong"
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Bare brown tree trunk and branches */}
      {/* Main trunk */}
      <rect x="21" y="28" width="6" height="14" fill="#78350F" rx="1" />
      
      {/* Branches */}
      <path
        d="M24 28 L24 20 M24 20 L19 14 M24 20 L29 14 M24 24 L18 20 M24 24 L30 20"
        stroke="#78350F"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Small branch details */}
      <path
        d="M19 14 L16 11 M19 14 L21 10 M29 14 L32 11 M29 14 L27 10"
        stroke="#92400E"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
