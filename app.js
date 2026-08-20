const STORAGE_KEY = "quiet-todo-flow-v7";
const BASE_NOW = new Date("2026-08-20T14:15:00+09:00");

const T = {
  homeEmptyTitle: "\u3044\u307e\u306f\u9759\u304b\u3067\u3059",
  homeEmptyMeta: "\u6b21\u306b\u3059\u308b\u3053\u3068\u306f\u3001\u307e\u3060\u3042\u308a\u307e\u305b\u3093\u3002",
  nextEmptyTitle: "\u6b21\u306e\u4e88\u5b9a\u306f\u3042\u308a\u307e\u305b\u3093",
  allEmpty: "\u8868\u793a\u3067\u304d\u308b\u9805\u76ee\u306f\u3042\u308a\u307e\u305b\u3093\u3002",
  required: "\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044",
  saved: "\u4fdd\u5b58\u3057\u307e\u3057\u305f",
  nowLabel: "\u3044\u307e",
  inboxLabel: "Inbox",
  untilLabel: "\u307e\u3067",
};

const state = loadState();

const appShell = document.querySelector(".app-shell");
const htmlRoot = document.documentElement;
const bodyRoot = document.body;
const topDate = document.querySelector("#top-date");
const homeView = document.querySelector("#home-view");
const allView = document.querySelector("#all-view");
const scheduleView = document.querySelector("#schedule-view");
const todoView = document.querySelector("#todo-view");
const memoView = document.querySelector("#memo-view");
const homePatternA = document.querySelector("#home-pattern-a");
const homePatternB = document.querySelector("#home-pattern-b");
const focusCardA = document.querySelector("#focus-card-a");
const focusCardB = document.querySelector("#focus-card-b");
const nextCardA = document.querySelector("#next-card-a");
const nextCardB = document.querySelector("#next-card-b");
const allList = document.querySelector("#all-list");
const fabWrap = document.querySelector(".fab-wrap");
const fabButton = document.querySelector("#fab-button");
const fabMenu = document.querySelector("#fab-menu");
const sortSwitch = document.querySelector("#sort-switch");

const scheduleForm = document.querySelector("#schedule-form");
const scheduleRaw = document.querySelector("#schedule-raw");
const scheduleStatus = document.querySelector("#schedule-status");

const todoForm = document.querySelector("#todo-form");
const todoRaw = document.querySelector("#todo-raw");
const todoStatus = document.querySelector("#todo-status");

const memoForm = document.querySelector("#memo-form");
const memoRaw = document.querySelector("#memo-raw");
const memoStatus = document.querySelector("#memo-status");

const focusTemplateA = document.querySelector("#focus-template-a");
const focusTemplateB = document.querySelector("#focus-template-b");
const nextTemplate = document.querySelector("#next-template");
const allItemTemplate = document.querySelector("#all-item-template");

boot();

function boot() {
  seedIfEmpty();
  syncVariantFromLocation();
  bindEvents();
  render();
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (_error) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  return {
    items: [],
    ui: {
      activeView: "home",
      homeVariant: "A",
      sortMode: "priority",
      fabOpen: false,
      scheduleStatus: "",
      todoStatus: "",
      memoStatus: "",
    },
  };
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function seedIfEmpty() {
  if (state.items.length > 0) return;

  state.items.push(
    enrichItemFromRaw("\u6b6f\u533b\u8005 \u4e88\u7d04 15\u6642", "schedule", "2026-08-20T13:20:00+09:00"),
    enrichItemFromRaw("\u8ab2\u984c \u63d0\u51fa \u91d1\u66dc \u5148\u751f", "todo", "2026-08-20T11:00:00+09:00"),
    enrichItemFromRaw("\u9752\u68ee\u770c\u7acb\u7f8e\u8853\u9928 \u5c55\u793a", "memo", "2026-08-20T10:20:00+09:00")
  );
  persist();
}

function bindEvents() {
  fabButton.addEventListener("click", toggleFabMenu);
  fabMenu.querySelectorAll("[data-open-view]").forEach((button) => {
    button.addEventListener("click", () => openView(button.dataset.openView));
  });

  document.querySelector("#back-from-all").addEventListener("click", () => openView("home"));
  document.querySelector("#back-from-schedule").addEventListener("click", () => openView("home"));
  document.querySelector("#back-from-todo").addEventListener("click", () => openView("home"));
  document.querySelector("#back-from-memo").addEventListener("click", () => openView("home"));

  document.querySelectorAll("[data-variant]").forEach((button) => {
    button.addEventListener("click", () => {
      state.ui.homeVariant = button.dataset.variant;
      persist();
      syncLocationFromVariant();
      renderHomeVariant();
      renderVariantChrome();
    });
  });

  sortSwitch.querySelectorAll("[data-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      state.ui.sortMode = button.dataset.sort;
      persist();
      renderSortButtons();
      renderAllList();
    });
  });

  scheduleForm.addEventListener("submit", (event) => handleRawSubmit(event, scheduleRaw, "schedule", "scheduleStatus"));
  todoForm.addEventListener("submit", (event) => handleRawSubmit(event, todoRaw, "todo", "todoStatus"));
  memoForm.addEventListener("submit", (event) => handleRawSubmit(event, memoRaw, "memo", "memoStatus"));
}

function toggleFabMenu() {
  state.ui.fabOpen = !state.ui.fabOpen;
  persist();
  renderFab();
}

function openView(viewName) {
  state.ui.activeView = viewName;
  state.ui.fabOpen = false;
  clearStatuses();
  persist();
  render();

  if (viewName === "schedule") scheduleRaw.focus();
  if (viewName === "todo") todoRaw.focus();
  if (viewName === "memo") memoRaw.focus();
}

function clearStatuses() {
  state.ui.scheduleStatus = "";
  state.ui.todoStatus = "";
  state.ui.memoStatus = "";
}

function handleRawSubmit(event, field, fallbackKind, statusKey) {
  event.preventDefault();
  const rawText = field.value.trim();
  if (!rawText) {
    state.ui[statusKey] = T.required;
    persist();
    renderStatuses();
    return;
  }

  state.items.push(enrichItemFromRaw(rawText, fallbackKind, getCurrentNow().toISOString()));
  field.value = "";
  state.ui[statusKey] = T.saved;
  persist();
  openView("home");
}

function enrichItemFromRaw(rawText, fallbackKind, createdAt) {
  const parsed = parseRawText(rawText, fallbackKind);
  return {
    id: createId(),
    rawText,
    kind: parsed.kind,
    title: parsed.title,
    support: parsed.support,
    action: parsed.action,
    tokens: parsed.tokens,
    scheduledAt: parsed.scheduledAt,
    deadlineAt: parsed.deadlineAt,
    nextActionAt: parsed.nextActionAt,
    createdAt,
    status: parsed.kind === "memo" || parsed.kind === "unknown" ? "inbox" : "active",
    reactionScore: 0,
    classification: parsed.classification,
  };
}

function parseRawText(rawText, fallbackKind) {
  const normalized = rawText.replace(/\s+/g, " ").trim();
  const tokens = normalized ? normalized.split(" ") : [];
  const timeInfo = parseTimeToken(tokens);
  const dayInfo = parseDayToken(tokens);
  const actionInfo = parseActionToken(tokens);

  const filteredTokens = tokens.filter((token) => token !== timeInfo.token && token !== dayInfo.token);
  const titleToken = filteredTokens.find((token) => token !== actionInfo.token) || filteredTokens[0] || rawText;
  const supportTokens = filteredTokens.filter((token) => token !== titleToken && token !== actionInfo.token);

  const kind = inferKind(fallbackKind, rawText, actionInfo, timeInfo, dayInfo);
  const title = buildTitle(titleToken, actionInfo, kind);
  const support = buildSupport(supportTokens, actionInfo);
  const scheduledAt = buildScheduledAt(kind, timeInfo, dayInfo);
  const deadlineAt = buildDeadlineAt(kind, dayInfo);
  const nextActionAt = buildNextActionAt(kind, scheduledAt, deadlineAt);

  return {
    kind,
    title,
    support,
    action: actionInfo.token,
    tokens,
    scheduledAt,
    deadlineAt,
    nextActionAt,
    classification: kind === "memo" ? "memo" : kind === "schedule" ? "schedule" : kind === "todo" ? "todo" : "unknown",
  };
}

function parseTimeToken(tokens) {
  const token = tokens.find((value) => /^\d{1,2}(:\d{2})?$/.test(value) || /^\d{1,2}時(半)?$/.test(value));
  if (!token) return { token: "", hours: null, minutes: null };
  if (token.includes(":")) {
    const [hours, minutes] = token.split(":").map(Number);
    return { token, hours, minutes };
  }
  const hours = Number(token.replace("時半", "").replace("時", ""));
  const minutes = token.includes("半") ? 30 : 0;
  return { token, hours, minutes };
}

function parseDayToken(tokens) {
  const weekMap = {
    "\u4eca\u65e5": 0,
    "\u660e\u65e5": 1,
    "\u91d1\u66dc": 1,
    "\u91d1\u66dc\u65e5": 1,
    "\u571f\u66dc": 2,
    "\u571f\u66dc\u65e5": 2,
    "\u65e5\u66dc": 3,
    "\u65e5\u66dc\u65e5": 3,
    "\u6708\u66dc": 4,
    "\u6708\u66dc\u65e5": 4,
  };
  const token = tokens.find((value) => weekMap[value] !== undefined);
  if (!token) return { token: "", date: null };
  const date = new Date(BASE_NOW);
  date.setDate(date.getDate() + weekMap[token]);
  return { token, date };
}

function parseActionToken(tokens) {
  const actions = ["\u63d0\u51fa", "\u4e88\u7d04", "\u8cb7\u3044\u7269", "\u6e96\u5099", "\u78ba\u8a8d"];
  const token = tokens.find((value) => actions.includes(value)) || "";
  return { token };
}

function inferKind(fallbackKind, rawText, actionInfo, timeInfo, dayInfo) {
  if (fallbackKind === "memo") return "memo";
  if (timeInfo.token || rawText.includes("\u4e88\u7d04")) return "schedule";
  if (dayInfo.token || actionInfo.token || fallbackKind === "todo") return "todo";
  return "unknown";
}

function buildTitle(titleToken, actionInfo, kind) {
  if (!titleToken) return "\u672a\u5206\u985e";
  if (kind === "todo" && actionInfo.token === "\u63d0\u51fa") return `${titleToken}\u63d0\u51fa`;
  return titleToken;
}

function buildSupport(supportTokens, actionInfo) {
  const parts = [];
  if (actionInfo.token && actionInfo.token !== "\u63d0\u51fa") parts.push(actionInfo.token);
  supportTokens.forEach((token) => parts.push(token));
  return parts.join(" ");
}

function buildScheduledAt(kind, timeInfo, dayInfo) {
  if (kind !== "schedule") return null;
  const date = dayInfo.date ? new Date(dayInfo.date) : new Date(BASE_NOW);
  const hours = timeInfo.hours ?? 9;
  const minutes = timeInfo.minutes ?? 0;
  date.setHours(hours, minutes, 0, 0);
  return toTokyoIso(date);
}

function buildDeadlineAt(kind, dayInfo) {
  if (kind !== "todo" || !dayInfo.date) return null;
  const date = new Date(dayInfo.date);
  date.setHours(18, 0, 0, 0);
  return toTokyoIso(date);
}

function buildNextActionAt(kind, scheduledAt, deadlineAt) {
  if (kind === "schedule") return scheduledAt;
  if (kind === "todo") return deadlineAt || getCurrentNow().toISOString();
  return null;
}

function render() {
  renderDate();
  renderViews();
  renderHomeVariant();
  renderVariantChrome();
  renderFocusCards();
  renderNextCards();
  renderFab();
  renderStatuses();
  renderSortButtons();
  renderAllList();
}

function renderDate() {
  topDate.textContent = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(BASE_NOW);
}

function renderViews() {
  const active = state.ui.activeView;
  homeView.classList.toggle("is-hidden", active !== "home");
  allView.classList.toggle("is-hidden", active !== "all");
  scheduleView.classList.toggle("is-hidden", active !== "schedule");
  todoView.classList.toggle("is-hidden", active !== "todo");
  memoView.classList.toggle("is-hidden", active !== "memo");
  fabWrap.classList.toggle("is-hidden", active !== "home");
}

function renderHomeVariant() {
  const isA = state.ui.homeVariant === "A";
  homePatternA.classList.toggle("is-hidden", !isA);
  homePatternB.classList.toggle("is-hidden", isA);
  document.querySelectorAll("[data-variant]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.variant === state.ui.homeVariant);
  });
}

function renderVariantChrome() {
  appShell.dataset.homeVariant = state.ui.homeVariant;
  htmlRoot.dataset.homeVariant = state.ui.homeVariant;
  bodyRoot.dataset.homeVariant = state.ui.homeVariant;
  const params = new URLSearchParams(window.location.search);
  const devMode = params.get("ab") === "1";
  document.querySelector(".home-variant-switch").classList.toggle("is-dev-visible", devMode);
}

function renderFocusCards() {
  const focusItem = getFocusItem();
  renderFocusCardInto(focusCardA, focusTemplateA, focusItem);
  renderFocusCardInto(focusCardB, focusTemplateB, focusItem);
}

function renderFocusCardInto(container, template, item) {
  container.innerHTML = "";
  if (!item) {
    container.innerHTML = `<article class="focus-article"><p class="focus-time">${T.nowLabel}</p><h1 class="focus-title">${T.homeEmptyTitle}</h1><p class="focus-support">${T.homeEmptyMeta}</p></article>`;
    return;
  }

  const fragment = template.content.cloneNode(true);
  fragment.querySelector(".focus-time").textContent = displayPrimaryTime(item);
  fragment.querySelector(".focus-title").textContent = item.title;
  fragment.querySelector(".focus-support").textContent = displaySupport(item);
  container.appendChild(fragment);
}

function renderNextCards() {
  const nextItem = getNextScheduleItem();
  renderNextCardInto(nextCardA, nextItem);
  renderNextCardInto(nextCardB, nextItem);
}

function renderNextCardInto(container, item) {
  container.innerHTML = "";
  const fragment = nextTemplate.content.cloneNode(true);
  fragment.querySelector(".next-time").textContent = item ? displayPrimaryTime(item) : "";
  fragment.querySelector(".next-title").textContent = item ? item.title : T.nextEmptyTitle;
  fragment.querySelector(".next-support").textContent = item ? displaySupport(item) : "";
  container.appendChild(fragment);
}

function renderFab() {
  fabMenu.classList.toggle("is-hidden", !state.ui.fabOpen);
  fabButton.setAttribute("aria-expanded", String(state.ui.fabOpen));
}

function syncVariantFromLocation() {
  const params = new URLSearchParams(window.location.search);
  const variant = (params.get("variant") || "").toUpperCase();
  if (variant === "A" || variant === "B") {
    state.ui.homeVariant = variant;
    persist();
  }
}

function syncLocationFromVariant() {
  const params = new URLSearchParams(window.location.search);
  params.set("variant", state.ui.homeVariant.toLowerCase());
  const nextUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", nextUrl);
}

function renderStatuses() {
  scheduleStatus.textContent = state.ui.scheduleStatus;
  todoStatus.textContent = state.ui.todoStatus;
  memoStatus.textContent = state.ui.memoStatus;
}

function renderSortButtons() {
  sortSwitch.querySelectorAll("[data-sort]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.sort === state.ui.sortMode);
  });
}

function renderAllList() {
  allList.innerHTML = "";
  if (state.ui.activeView !== "all") return;

  const items = getAllItemsSorted();
  if (items.length === 0) {
    allList.innerHTML = `<p class="all-empty">${T.allEmpty}</p>`;
    return;
  }

  items.forEach((item) => {
    const fragment = allItemTemplate.content.cloneNode(true);
    fragment.querySelector(".all-time").textContent = displayPrimaryTime(item);
    fragment.querySelector(".all-title").textContent = item.title;
    fragment.querySelector(".all-support").textContent = displaySupport(item);
    allList.appendChild(fragment);
  });
}

function getFocusItem() {
  return state.items
    .filter((item) => item.kind !== "memo")
    .sort((left, right) => compareByPriority(left, right))[0] || null;
}

function getNextScheduleItem() {
  const focusItem = getFocusItem();
  return state.items
    .filter((item) => item.kind === "schedule" && item.id !== (focusItem && focusItem.id))
    .sort((left, right) => compareByTime(left, right))[0] || null;
}

function getAllItemsSorted() {
  const items = state.items.slice();
  if (state.ui.sortMode === "time") return items.sort((left, right) => compareByTime(left, right));
  return items.sort((left, right) => compareByPriority(left, right));
}

function compareByPriority(left, right) {
  const priorityDiff = calculatePriorityScore(right) - calculatePriorityScore(left);
  if (priorityDiff !== 0) return priorityDiff;
  return compareByTime(left, right);
}

function compareByTime(left, right) {
  const leftTime = getChronologicalValue(left);
  const rightTime = getChronologicalValue(right);
  if (leftTime === rightTime) return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
  return leftTime - rightTime;
}

function calculatePriorityScore(item) {
  const now = getCurrentNow().getTime();
  let score = 0;
  const schedule = item.scheduledAt ? new Date(item.scheduledAt).getTime() : null;
  const deadline = item.deadlineAt ? new Date(item.deadlineAt).getTime() : null;
  const nextAction = item.nextActionAt ? new Date(item.nextActionAt).getTime() : null;

  if (item.kind === "schedule") score += 120;
  if (item.kind === "todo") score += 80;
  if (item.kind === "memo") score += 30;
  if (item.status === "inbox") score += 10;

  if (schedule) {
    const diff = schedule - now;
    if (diff <= 60 * 60 * 1000) score += 180;
    else if (diff <= 3 * 60 * 60 * 1000) score += 110;
    else if (diff <= 24 * 60 * 60 * 1000) score += 70;
  }

  if (deadline) {
    const diff = deadline - now;
    if (diff <= 24 * 60 * 60 * 1000) score += 130;
    else if (diff <= 48 * 60 * 60 * 1000) score += 70;
  }

  if (nextAction && nextAction <= now) score += 40;
  return score;
}

function getChronologicalValue(item) {
  const values = [item.scheduledAt, item.deadlineAt, item.nextActionAt]
    .filter(Boolean)
    .map((value) => new Date(value).getTime())
    .sort((left, right) => left - right);
  return values[0] ?? Number.MAX_SAFE_INTEGER;
}

function displayPrimaryTime(item) {
  if (item.scheduledAt) return formatLeadTime(item.scheduledAt);
  if (item.deadlineAt) return formatLeadTime(item.deadlineAt);
  if (item.nextActionAt) return formatLeadTime(item.nextActionAt);
  return item.kind === "memo" ? T.inboxLabel : T.nowLabel;
}

function displaySupport(item) {
  if (item.support) return item.support;
  if (item.kind === "todo" && item.deadlineAt) return `${formatLeadTime(item.deadlineAt)} ${T.untilLabel}`;
  if (item.kind === "memo" || item.kind === "unknown") return item.rawText;
  return "";
}

function formatLeadTime(value) {
  const date = new Date(value);
  const now = getCurrentNow();
  if (sameDay(date, now)) return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  if (isTomorrow(date, now)) return formatWeekday(date);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function formatWeekday(date) {
  return new Intl.DateTimeFormat("ja-JP", { weekday: "short" }).format(date);
}

function isTomorrow(date, base) {
  const oneDay = 24 * 60 * 60 * 1000;
  return stripTime(date).getTime() - stripTime(base).getTime() === oneDay;
}

function getCurrentNow() {
  return new Date(BASE_NOW);
}

function toTokyoIso(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00+09:00`;
}

function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function sameDay(a, b) {
  const left = new Date(a);
  const right = new Date(b);
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate();
}

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
  return `item-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function pad(value) {
  return String(value).padStart(2, "0");
}
