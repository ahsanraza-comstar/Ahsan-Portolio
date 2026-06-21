import { whatsappLink, WhatsAppIcon } from '../../lib/whatsapp'

export default function WhatsAppFab() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
      className="fixed bottom-6 left-6 z-[55] w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      style={{ background: '#25D366', boxShadow: '0 8px 24px -4px rgba(37,211,102,0.6)' }}
    >
      <WhatsAppIcon className="w-7 h-7 text-white" />
    </a>
  )
}
