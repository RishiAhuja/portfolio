// Share links are ordinary links to a frame's own page. With JavaScript they
// open the device's share sheet, or copy the link where there isn't one.
document.querySelectorAll<HTMLAnchorElement>('[data-share]').forEach((link) => {
  const label = link.querySelector('[data-share-label]');
  const idle = label?.textContent ?? '';
  let timer = 0;

  link.addEventListener('click', async (event) => {
    const url = new URL(link.getAttribute('href')!, window.location.href).href;
    const data = { url, title: link.dataset.shareTitle, text: link.dataset.shareText || undefined };
    if (navigator.share && (!navigator.canShare || navigator.canShare(data))) {
      event.preventDefault();
      // Dismissing the share sheet rejects; that isn't an error worth showing.
      try { await navigator.share(data); } catch { /* cancelled */ }
      return;
    }
    if (!navigator.clipboard) return; // Follow the link instead.
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(url);
      if (label) label.textContent = 'Link copied';
    } catch {
      window.location.href = url;
      return;
    }
    window.clearTimeout(timer);
    timer = window.setTimeout(() => { if (label) label.textContent = idle; }, 1600);
  });
});
