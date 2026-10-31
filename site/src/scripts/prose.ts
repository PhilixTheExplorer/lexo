import "./copy";

const labels = {
  en: { idle: "Copy", copied: "Copied", failed: "Select and copy", aria: "Copy code" },
  my: { idle: "ကူးယူရန်", copied: "ကူးယူပြီးပါပြီ", failed: "စာသားကို ရွေးပြီး ကူးယူပါ", aria: "code ကို ကူးယူရန်" },
};

const lang = document.documentElement.lang === "my" ? "my" : "en";
const l = labels[lang];
const icon =
  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8.5" y="8.5" width="11" height="11" rx="1.5"/><path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"/></svg>';

for (const pre of document.querySelectorAll<HTMLPreElement>(".prose pre")) {
  const text = pre.querySelector("code")?.textContent ?? pre.textContent ?? "";
  const wrap = document.createElement("div");
  wrap.className = "code-wrap";
  pre.replaceWith(wrap);
  wrap.append(pre);
  const button = document.createElement("button");
  button.type = "button";
  button.className = "code-copy";
  button.dataset.copy = text.replace(/\n$/, "");
  button.dataset.idle = l.idle;
  button.dataset.copied = l.copied;
  button.dataset.failed = l.failed;
  button.setAttribute("aria-label", l.aria);
  button.innerHTML = `${icon}<span data-copy-label aria-hidden="true">${l.idle}</span><span class="sr-only" role="status" data-copy-status></span>`;
  wrap.append(button);
}
