/**
 * TASK006
 * Перехоплює window.alert і показує toast-повідомлення замість браузерного alert().
 * Працює тільки на клієнті (client plugin).
 */

type ToastType = 'info' | 'success' | 'warning' | 'error'

function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function ensureStyles() {
  const id = 'jobboard-toast-styles'
  if (document.getElementById(id)) return

  const style = document.createElement('style')
  style.id = id
  style.textContent = `
    .jb-toast-root{
      position: fixed;
      right: 16px;
      bottom: 16px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: min(420px, calc(100vw - 32px));
      pointer-events: none;
    }
    .jb-toast{
      pointer-events: auto;
      display: grid;
      grid-template-columns: 10px 1fr auto;
      align-items: start;
      gap: 10px;
      padding: 12px 12px;
      border-radius: 16px;
      border: 1px solid rgba(148,163,184,.55);
      background: rgba(255,255,255,.92);
      backdrop-filter: blur(10px);
      box-shadow: 0 10px 30px rgba(2,6,23,.12);
      transform: translateY(8px);
      opacity: 0;
      transition: transform .18s ease, opacity .18s ease;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Sans", "Liberation Sans", sans-serif;
    }
    .jb-toast--show{ transform: translateY(0); opacity: 1; }
    .jb-toast__bar{
      width: 10px;
      height: 10px;
      border-radius: 999px;
      margin-top: 4px;
      background: #2563eb; /* info */
    }
    .jb-toast[data-type="success"] .jb-toast__bar{ background: #16a34a; }
    .jb-toast[data-type="warning"] .jb-toast__bar{ background: #f59e0b; }
    .jb-toast[data-type="error"]   .jb-toast__bar{ background: #ef4444; }

    .jb-toast__msg{
      font-size: 13px;
      line-height: 1.35;
      color: #0f172a;
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .jb-toast__close{
      border: 0;
      background: transparent;
      color: #475569;
      font-size: 16px;
      line-height: 1;
      cursor: pointer;
      padding: 2px 6px;
      border-radius: 10px;
    }
    .jb-toast__close:hover{
      background: rgba(148,163,184,.25);
    }

    @media (prefers-color-scheme: dark){
      .jb-toast{
        background: rgba(15,23,42,.86);
        border-color: rgba(148,163,184,.22);
        box-shadow: 0 10px 30px rgba(0,0,0,.35);
      }
      .jb-toast__msg{ color: #e2e8f0; }
      .jb-toast__close{ color: #cbd5e1; }
      .jb-toast__close:hover{ background: rgba(148,163,184,.18); }
    }
  `
  document.head.appendChild(style)
}

function ensureRoot(): HTMLDivElement {
  ensureStyles()
  const id = 'jobboard-toast-root'
  let root = document.getElementById(id) as HTMLDivElement | null
  if (!root) {
    root = document.createElement('div')
    root.id = id
    root.className = 'jb-toast-root'
    document.body.appendChild(root)
  }
  return root
}

function showToast(message: string, type: ToastType = 'info', ms = 2600) {
  const root = ensureRoot()

  const toast = document.createElement('div')
  toast.className = 'jb-toast'
  toast.dataset.type = type

  toast.innerHTML = `
    <div class="jb-toast__bar"></div>
    <p class="jb-toast__msg">${escapeHtml(String(message ?? ''))}</p>
    <button class="jb-toast__close" aria-label="Закрити">×</button>
  `

  const closeBtn = toast.querySelector('.jb-toast__close') as HTMLButtonElement
  const remove = () => {
    toast.classList.remove('jb-toast--show')
    window.setTimeout(() => {
      toast.remove()
    }, 180)
  }

  closeBtn.addEventListener('click', remove)

  root.appendChild(toast)
  requestAnimationFrame(() => toast.classList.add('jb-toast--show'))

  window.setTimeout(remove, ms)
}

export default defineNuxtPlugin(() => {
  // Глобальна функція (можна використовувати в коді: window.notify("...", "success"))
  ;(window as any).notify = (message: string, type: ToastType = 'info') => showToast(message, type)

  // Перехоплюємо alert()
  const nativeAlert = window.alert.bind(window)
  window.alert = (message?: any) => {
    // якщо хтось передає об'єкт — покажемо його як текст
    try {
      showToast(typeof message === 'string' ? message : JSON.stringify(message), 'info')
    } catch {
      showToast(String(message ?? ''), 'info')
    }
    // nativeAlert(message) // НЕ викликаємо, щоб не блокував UI
  }

  // Додатково: короткий хелпер в Nuxt (для useNuxtApp().$notify)
  return {
    provide: {
      notify: (message: string, type: ToastType = 'info') => showToast(message, type)
    }
  }
})
