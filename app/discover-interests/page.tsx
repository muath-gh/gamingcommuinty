import type { Metadata } from 'next';
import WizardShell from './components/WizardShell';

export const metadata: Metadata = {
  title: 'اكتشف ميولك - مركز الألعاب',
  description: 'أجب عن بضعة أسئلة لبناء ملفك الشخصي واكتشاف الألعاب التي تناسب أسلوبك',
};

export default function DiscoverInterestsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 py-16 px-6">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        <div className="relative max-w-2xl mx-auto">
          <WizardShell />
        </div>
      </div>
    </div>
  );
}
