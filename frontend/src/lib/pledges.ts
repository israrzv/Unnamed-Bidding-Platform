// Client-side persistence of a user's pledges per arena, so they survive
// navigation. (The Go backend enforces a single pledge; persisting revisions
// there is a separate change — this keeps the arena experience stateful now.)

const KEY = "bidfair:pledges";

type Store = Record<string, number[]>;

function read(): Store {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "{}") as Store;
  } catch {
    return {};
  }
}

function write(store: Store) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(store));
}

export function getPledges(arenaId: string): number[] {
  return read()[arenaId] ?? [];
}

export function addPledge(arenaId: string, amount: number) {
  const store = read();
  store[arenaId] = [...(store[arenaId] ?? []), amount];
  write(store);
}

export function getParticipations(): { id: string; pledges: number[] }[] {
  return Object.entries(read())
    .filter(([, pledges]) => pledges.length > 0)
    .map(([id, pledges]) => ({ id, pledges }));
}
