/**
 * TASK006-FIX1
 * Яскраві, помітні toast-повідомлення замість alert()
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
      left: 50%;
      bottom: 30%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 14px;
      max-width: min(520px, calc(100vw - 32px));
      pointer-events: none;
    }

    .jb-toast{
      pointer-events: auto;
      display: grid;
      grid-template-columns: 12px 1fr auto;
      align-items: start;
      gap: 12px;
      padding: 18px 18px;
      border-radius: 20px;
      border: 2px solid rgba(148,163,184,.55);
      background: linear-gradient(135deg, #f8fafc, #eef2ff);
      box-shadow: 0 20px 50px rgba(2,6,23,.25);
      transform: translateY(16px) scale(.96);
      opacity: 0;
      transition: transform .22s ease, opacity .22s ease;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Sans", "Liberation Sans", sans-serif;
    }
    .jb-toast--show{
      transform: translateY(0) scale(1);
      opacity: 1;
    }

    .jb-toast__bar{
      width: 12px;
      height: 12px;
      border-radius: 999px;
      margin-top: 6px;
      background: #2563eb; /* info */
    }
    .jb-toast[data-type="success"] .jb-toast__bar{ background: #16a34a; }
    .jb-toast[data-type="warning"] .jb-toast__bar{ background: #f59e0b; }
    .jb-toast[data-type="error"]   .jb-toast__bar{ background: #ef4444; }

    .jb-toast__msg{
      font-size: 16px;
      line-height: 1.45;
      color: #0f172a;
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
      font-weight: 500;
    }

    .jb-toast__close{
      border: 0;
      background: rgba(148,163,184,.25);
      color: #0f172a;
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
      padding: 4px 10px;
      border-radius: 999px;
    }
    .jb-toast__close:hover{
      background: rgba(148,163,184,.45);
    }

    @media (prefers-color-scheme: dark){
      .jb-toast{
        background: linear-gradient(135deg, #020617, #020617);
        border-color: rgba(148,163,184,.35);
        box-shadow: 0 20px 60px rgba(0,0,0,.6);
      }
      .jb-toast__msg{ color: #e5e7eb; }
      .jb-toast__close{ color: #e5e7eb; background: rgba(148,163,184,.2); }
      .jb-toast__close:hover{ background: rgba(148,163,184,.35); }
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

function showToast(message: string, type: ToastType = 'info', ms = 5000) {
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
    window.setTimeout(() => toast.remove(), 220)
  }

  closeBtn.addEventListener('click', remove)

  root.appendChild(toast)
  requestAnimationFrame(() => toast.classList.add('jb-toast--show'))

  window.setTimeout(remove, ms)
}

export default defineNuxtPlugin(() => {
  ;(window as any).notify = (message: string, type: ToastType = 'info') =>
    showToast(message, type)

  const nativeAlert = window.alert.bind(window)
  window.alert = (message?: any) => {
    try {
      showToast(
        typeof message === 'string' ? message : JSON.stringify(message),
        'info'
      )
    } catch {
      showToast(String(message ?? ''), 'info')
    }
    // nativeAlert(message) // вимкнено навмисно
  }

  return {
    provide: {
      notify: (message: string, type: ToastType = 'info') =>
        showToast(message, type)
    }
  }
})
