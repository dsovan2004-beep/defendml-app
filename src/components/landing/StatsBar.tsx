// src/components/landing/StatsBar.tsx
import { PRODUCT } from '../../lib/productConstants';

const stats = [
  { value: String(PRODUCT.attackLibrarySize), label: 'Attack Scenarios' },
  { value: `${PRODUCT.scanPromptCount}`, label: 'Prompts Per Scan' },
  { value: PRODUCT.aslCoverage, label: 'ASL-3 Coverage' },
  { value: PRODUCT.deliveryLabel, label: 'Evidence Delivery' },
];

export default function StatsBar() {
  return (
    <section className="bg-[#111111] border-y border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center group">
              <div className="text-3xl sm:text-4xl font-extrabold text-red-500 mb-1 group-hover:text-red-400 transition-colors">
                {s.value}
              </div>
              <div className="text-sm text-[#A0A0A0] font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
