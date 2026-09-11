import type { ReactNode } from "react";

export const DemoWorkspaceBanner = ({ onReset, isResetting }: { onReset: () => void; isResetting?: boolean }) => (
  <div className="relative z-50 border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900 sm:px-6 lg:px-8">
    <div className="mx-auto flex max-w-[1400px] flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <p><span className="font-semibold">Sample workspace</span> — data is stored locally for demonstration and must not be used for production decisions.</p>
      <button type="button" onClick={onReset} disabled={isResetting} className="self-start rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 transition hover:bg-amber-100 disabled:opacity-50 sm:self-auto">
        {isResetting ? "Resetting…" : "Reset demo data"}
      </button>
    </div>
  </div>
);

export const ConfirmDialog = ({ title, description, confirmLabel = "Confirm", confirmDisabled = false, onConfirm, onClose, children }: { title: string; description: string; confirmLabel?: string; confirmDisabled?: boolean; onConfirm: () => void; onClose: () => void; children?: ReactNode }) => (
  <div aria-modal="true" role="dialog" aria-labelledby="confirmation-title" className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-4">
    <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 shadow-2xl">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-red-600">Confirmation required</p>
      <h2 id="confirmation-title" className="mt-2 text-xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      {children}
      <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button><button type="button" disabled={confirmDisabled} onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">{confirmLabel}</button></div>
    </div>
  </div>
);
