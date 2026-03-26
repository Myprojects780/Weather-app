import { Download } from 'lucide-react'

interface InstallAppButtonProps {
  canInstall: boolean
  installed: boolean
  onInstall: () => Promise<unknown>
}

export function InstallAppButton({ canInstall, installed, onInstall }: InstallAppButtonProps) {
  return (
    <button
      type="button"
      onClick={() => void onInstall()}
      disabled={!canInstall}
      title={
        installed
          ? 'Let it rain is already installed.'
          : canInstall
            ? 'Install Let it rain.'
            : 'Installation is available in supported browsers.'
      }
      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/12 disabled:cursor-not-allowed disabled:text-stone-400"
    >
      <Download className="h-4 w-4" />
      {installed ? 'Installed' : 'Install app'}
    </button>
  )
}
