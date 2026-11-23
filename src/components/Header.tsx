interface HeaderProps {
  brandName?: string;
}

export function Header({ brandName = 'マイ旅' }: HeaderProps) {
  return (
    <header className="mb-8 sm:mb-10">
      {/* Brand Logo Area (replaceable placeholder) */}
      <div className="mb-5 flex items-center">
        <div className="inline-flex items-center gap-2.5 text-[#26231E]">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="shrink-0"
          >
            <circle cx="14" cy="14" r="13" stroke="#A68446" strokeWidth="1.5" />
            <path
              d="M8.5 16.5L19.5 10.5L15.5 18.5L13.5 15L8.5 16.5Z"
              fill="#A68446"
              stroke="#A68446"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-lg font-bold tracking-wide text-[#26231E]">
            {brandName}
          </span>
        </div>
      </div>

      {/* Main Title & Accent Line */}
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight text-[#26231E] sm:text-3xl md:text-[34px]">
          1マイル単価シミュレーター
        </h1>
        <div
          className="mt-3 h-[3px] w-16 rounded-full bg-[#A68446]"
          aria-hidden="true"
        />
        <p className="mt-4 text-sm leading-relaxed text-[#625B51] sm:text-[15px]">
          特典航空券を利用する際、1マイルが何円相当になるかを算出できるシミュレーターです。比較リストに複数追加すると、並べて比較検討できます。
        </p>
      </div>
    </header>
  );
}
