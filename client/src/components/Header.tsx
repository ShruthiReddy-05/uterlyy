import { Settings } from 'lucide-react';

export default function Header() {
  return (
    <header className="py-4 px-6 bg-white shadow-sm z-10">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-slate-900">Uterly</h1>
        <button className="p-2 rounded-full hover:bg-neutral-100" aria-label="Settings">
          <Settings className="h-5 w-5 text-slate-900" />
        </button>
      </div>
    </header>
  );
}
