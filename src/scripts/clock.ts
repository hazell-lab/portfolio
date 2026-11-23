// the local time in malaysia, shown in the hero
import { byId } from './env';

export function initClock(): void {
  const clock = byId<HTMLTimeElement>('local-time');
  if (!clock) return;

  const format = new Intl.DateTimeFormat('en-GB', {
    timeZone: clock.dataset['zone'] ?? 'Asia/Kuala_Lumpur',
    hour: '2-digit',
    minute: '2-digit',
  });

  const update = () => {
    const now = new Date();
    clock.textContent = `Malaysia, ${format.format(now)} GMT+8`;
    clock.dateTime = now.toISOString();
  };

  update();
  // update every 30s, and only while the tab is visible
  window.setInterval(() => {
    if (!document.hidden) update();
  }, 30000);
}
