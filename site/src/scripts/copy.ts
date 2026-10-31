const RESET_MS = 1600;

async function writeClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

document.addEventListener("click", async (event) => {
  const button = (event.target as Element | null)?.closest<HTMLButtonElement>("[data-copy]");
  if (!button) return;
  const text = button.dataset.copy ?? "";
  const label = button.querySelector<HTMLElement>("[data-copy-label]");
  const status = button.querySelector<HTMLElement>("[data-copy-status]");
  const ok = await writeClipboard(text);
  button.dataset.state = ok ? "copied" : "failed";
  const message = ok ? button.dataset.copied : button.dataset.failed;
  if (label && message) label.textContent = message;
  if (status && message) status.textContent = message;
  window.setTimeout(() => {
    delete button.dataset.state;
    if (label) label.textContent = button.dataset.idle ?? "";
    if (status) status.textContent = "";
  }, RESET_MS);
});
