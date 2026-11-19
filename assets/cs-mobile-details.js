const mobileViewport = matchMedia('(max-width: 700px)');
const sheetToggle = document.createElement('button');
sheetToggle.type = 'button';
sheetToggle.className = 'cs-sheet-toggle';
sheetToggle.hidden = true;
document.body.append(sheetToggle);

let activePanel = null;
let expanded = true;
let panelSequence = 0;

function renderSheet() {
  const enabled = mobileViewport.matches && activePanel !== null;
  sheetToggle.hidden = !enabled;
  document.body.toggleAttribute('data-mobile-details', enabled);
  if (!activePanel) return;
  activePanel.toggleAttribute('data-mobile-sheet', enabled);
  activePanel.toggleAttribute('data-sheet-collapsed', enabled && !expanded);
  activePanel.inert = enabled && !expanded;
  sheetToggle.setAttribute('aria-expanded', String(expanded));
  sheetToggle.setAttribute('aria-controls', activePanel.id);
  sheetToggle.dataset.expanded = String(expanded);
  const title = location.hash.startsWith('#claims') ? 'Claim Details' : 'Order Details';
  const actionLabel = `${expanded ? 'Collapse' : 'Expand'} ${title}`;
  sheetToggle.setAttribute('aria-label', actionLabel);
  sheetToggle.title = actionLabel;
  sheetToggle.textContent = '';
}

function setExpanded(nextExpanded) {
  if (!activePanel) return;
  if (!nextExpanded && activePanel.contains(document.activeElement)) sheetToggle.focus();
  expanded = nextExpanded;
  renderSheet();
}

function syncPanel() {
  const nextPanel = document.querySelector('main:has([role="grid"][aria-label="Orders"], [role="grid"][aria-label="Claims"]) .m-split-wGUpkE > .m-body-UK8L6U');
  if (nextPanel === activePanel) return;
  if (activePanel) {
    activePanel.removeAttribute('data-mobile-sheet');
    activePanel.removeAttribute('data-sheet-collapsed');
    activePanel.inert = false;
  }
  activePanel = nextPanel;
  expanded = true;
  if (activePanel && !activePanel.id) activePanel.id = `cs-mobile-detail-${++panelSequence}`;
  renderSheet();
}

let gestureStart = null;
let suppressGestureClick = false;

sheetToggle.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0) return;
  gestureStart = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
  suppressGestureClick = false;
  sheetToggle.setPointerCapture(event.pointerId);
});
sheetToggle.addEventListener('pointerup', event => {
  if (!gestureStart || gestureStart.pointerId !== event.pointerId) return;
  const deltaY = event.clientY - gestureStart.y;
  const deltaX = event.clientX - gestureStart.x;
  const threshold = sheetToggle.getBoundingClientRect().height / 2;
  gestureStart = null;
  if (Math.abs(deltaY) < threshold || Math.abs(deltaY) <= Math.abs(deltaX)) return;
  suppressGestureClick = true;
  setExpanded(deltaY < 0);
});
sheetToggle.addEventListener('pointercancel', () => { gestureStart = null; });
sheetToggle.addEventListener('lostpointercapture', () => { gestureStart = null; });
sheetToggle.addEventListener('click', event => {
  if (suppressGestureClick && event.detail !== 0) {
    suppressGestureClick = false;
    event.preventDefault();
    return;
  }
  suppressGestureClick = false;
  setExpanded(!expanded);
});
mobileViewport.addEventListener('change', renderSheet);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && mobileViewport.matches && activePanel && expanded && !document.querySelector('[role="dialog"], [role="menu"], [role="listbox"]')) {
    setExpanded(false);
  }
});
document.addEventListener('click', event => {
  if (!mobileViewport.matches || !(event.target instanceof Element)) return;
  const row = event.target.closest('[role="row"]');
  const grid = row?.closest('[role="grid"]');
  if (!grid || !['Orders', 'Claims'].includes(grid.getAttribute('aria-label')) || !row.querySelector('[role="gridcell"], [role="rowheader"]')) return;
  if (event.target.closest('button, a, input, [role="checkbox"], [role="menuitem"]')) return;
  requestAnimationFrame(() => { syncPanel(); setExpanded(true); });
}, true);
new MutationObserver(syncPanel).observe(document.getElementById('root'), { childList: true, subtree: true });
syncPanel();