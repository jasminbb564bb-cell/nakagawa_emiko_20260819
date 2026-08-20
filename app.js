const STORAGE_KEY = "quiet-todo-flow-v13";
const TOKYO_TIME_ZONE = "Asia/Tokyo";

const STATES = {
  INBOX: "INBOX",
  NEED_INFO: "NEED_INFO",
  DATE_UNCONFIRMED: "DATE_UNCONFIRMED",
  UPCOMING: "UPCOMING",
  ACTION_NOW: "ACTION_NOW",
  PAST_UNCONFIRMED: "PAST_UNCONFIRMED",
  DONE: "DONE",
};

const translations = {
  ja: {
    heroMain: "今必要なことだけを、静かに見る。",
    heroSub: "思いついたら雑に入れて、見るときだけ整える。",
    nowHeading: "Now",
    nextHeading: "Next",
    navHome: "home",
    navAll: "all",
    navInput: "input",
    navNowLower: "now",
    navNextLower: "next",
    back: "戻る",
    viewAll: "すべてを見る",
    sortPriority: "優先順",
    sortTime: "時間順",
    newSchedule: "新しい予定",
    addTodo: "やることを追加",
    memo: "メモ",
    entryMain: "思いついたまま、スペースで。",
    entrySub: "Leave it here. We'll sort it.",
    rawInput: "雑に入力",
    inputText: "入力文",
    save: "保存",
    rewrite: "書き直す",
    editMain: "元の入力文をそのまま書き直します。",
    editSub: "Leave it here. We'll sort it again.",
    schedulePlaceholder: "歯医者 予約 15時",
    todoPlaceholder: "課題 提出 金曜 先生",
    memoPlaceholder: "青森県立美術館 展示",
    homeEmptyTitle: "いまは静かです",
    homeEmptyMeta: "次にすることは、まだありません。",
    nextEmptyTitle: "次の予定はありません",
    allEmpty: "表示できる項目はありません。",
    required: "入力してください",
    saved: "保存しました",
    updated: "書き直しました",
    nowLabel: "いま",
    inboxLabel: "Inbox",
    needsInfoLabel: "後で確認",
    dateUnconfirmedLabel: "日付未確認",
    pastQuestion: "どうなりましたか？",
    dateQuestion: "いつの{weekday}ですか？",
    inboxQuestion: "予定ですか？",
    dateUnconfirmedSupport: "日付がまだ確定していません",
    needInfoSupport: "時間や期限を後で確認します",
    doneAction: "終える",
    rescheduleAction: "あらためる",
    changeTimeAction: "時間を変える",
    makeSchedule: "予定にする",
    research: "調べる",
    keepAsIs: "そのまま",
    nextOption: "次 {date}",
    followingOption: "来週 {date}",
  },
  en: {
    heroMain: "See only what matters now.",
    heroSub: "Capture it roughly. Let it settle when you look.",
    nowHeading: "Now",
    nextHeading: "Next",
    navHome: "home",
    navAll: "all",
    navInput: "input",
    navNowLower: "now",
    navNextLower: "next",
    back: "Back",
    viewAll: "View all",
    sortPriority: "Priority",
    sortTime: "Timeline",
    newSchedule: "New event",
    addTodo: "Add task",
    memo: "Note",
    entryMain: "Write freely. Separate with spaces.",
    entrySub: "Leave it here. We'll sort it.",
    rawInput: "Raw input",
    inputText: "Input",
    save: "Save",
    rewrite: "Rewrite",
    editMain: "Rewrite the original input directly.",
    editSub: "Leave it here. We'll sort it again.",
    schedulePlaceholder: "Dentist appointment 3pm",
    todoPlaceholder: "Assignment submit Friday teacher",
    memoPlaceholder: "Aomori Museum exhibition",
    homeEmptyTitle: "Quiet for now",
    homeEmptyMeta: "There is nothing next just yet.",
    nextEmptyTitle: "No next plan",
    allEmpty: "There is nothing to show.",
    required: "Please enter something",
    saved: "Saved",
    updated: "Updated",
    nowLabel: "Now",
    inboxLabel: "Inbox",
    needsInfoLabel: "Need info",
    dateUnconfirmedLabel: "Date unconfirmed",
    pastQuestion: "How did it go?",
    dateQuestion: "Which {weekday} is it?",
    inboxQuestion: "Is this an event?",
    dateUnconfirmedSupport: "The date has not been confirmed yet.",
    needInfoSupport: "We need time or due date later.",
    doneAction: "Done",
    rescheduleAction: "Reschedule",
    changeTimeAction: "Change time",
    makeSchedule: "Make it an event",
    research: "Look into it",
    keepAsIs: "Leave it",
    nextOption: "Next {date}",
    followingOption: "Following {date}",
  },
};

const SUPPORT_SCRIPTS = [
  "./notification-history.js",
  "./behavior-analytics.js",
  "./learning-profile.js",
  "./notification-selector.js",
];

const appShell = document.querySelector(".app-shell");
const htmlRoot = document.documentElement;
const bodyRoot = document.body;
const topDate = document.querySelector("#top-date");
const homeView = document.querySelector("#home-view");
const allView = document.querySelector("#all-view");
const scheduleView = document.querySelector("#schedule-view");
const todoView = document.querySelector("#todo-view");
const memoView = document.querySelector("#memo-view");
const editView = document.querySelector("#edit-view");
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
const completionSignal = document.querySelector("#completion-signal");
const completionIconTrash = document.querySelector("#completion-icon-trash");
const completionIconArchive = document.querySelector("#completion-icon-archive");

const scheduleForm = document.querySelector("#schedule-form");
const scheduleRaw = document.querySelector("#schedule-raw");
const scheduleStatus = document.querySelector("#schedule-status");
const todoForm = document.querySelector("#todo-form");
const todoRaw = document.querySelector("#todo-raw");
const todoStatus = document.querySelector("#todo-status");
const memoForm = document.querySelector("#memo-form");
const memoRaw = document.querySelector("#memo-raw");
const memoStatus = document.querySelector("#memo-status");
const editForm = document.querySelector("#edit-form");
const editRaw = document.querySelector("#edit-raw");
const editStatus = document.querySelector("#edit-status");

const focusTemplateA = document.querySelector("#focus-template-a");
const focusTemplateB = document.querySelector("#focus-template-b");
const nextTemplate = document.querySelector("#next-template");
const allItemTemplate = document.querySelector("#all-item-template");

const state = loadState();

loadSupportScripts()
  .then(() => boot())
  .catch(() => boot());

function loadSupportScripts() {
  return Promise.all(
    SUPPORT_SCRIPTS.map((src) => {
      if (document.querySelector(`script[data-support-script="${src}"]`)) return Promise.resolve();
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = false;
        script.dataset.supportScript = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    })
  );
}

function boot() {
  ensureLearningState();
  seedIfEmpty();
  syncVariantFromLocation();
  syncCompletionModeFromLocation();
  bindEvents();
  render();
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      parsed.userLearning = parsed.userLearning || { termKinds: {}, history: [] };
      parsed.ui = {
        activeView: "home",
        homeVariant: "A",
        completionMode: "archive",
        sortMode: "priority",
        language: "ja",
        fabOpen: false,
        scheduleStatus: "",
        todoStatus: "",
        memoStatus: "",
        editStatus: "",
        editingItemId: null,
        ...parsed.ui,
      };
      return parsed;
    } catch (_error) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  return {
    items: [],
    userLearning: { termKinds: {}, history: [] },
    ui: {
      activeView: "home",
      homeVariant: "A",
      completionMode: "archive",
      sortMode: "priority",
      language: "ja",
      fabOpen: false,
      scheduleStatus: "",
      todoStatus: "",
      memoStatus: "",
      editStatus: "",
      editingItemId: null,
    },
  };
}

function persist() {
  ensureLearningState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function ensureLearningState() {
  if (window.QuietNotificationHistory) window.QuietNotificationHistory.ensureState(state);
  if (window.QuietLearningProfile) window.QuietLearningProfile.ensureState(state);
  if (!state.notificationHistory) state.notificationHistory = [];
}

function t(key, vars = {}) {
  const table = translations[state.ui.language] || translations.ja;
  let text = table[key] || translations.ja[key] || key;
  Object.entries(vars).forEach(([name, value]) => {
    text = text.replace(`{${name}}`, value);
  });
  return text;
}

function seedIfEmpty() {
  if (state.items.length > 0) return;
  const now = getCurrentNow();
  state.items.push(
    enrichItemFromRaw("歯医者 予約 15時", "schedule", new Date(now.getTime() - 60 * 60 * 1000).toISOString()),
    enrichItemFromRaw("課題 提出 金曜 先生", "todo", new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()),
    enrichItemFromRaw("青森県立美術館 展示", "memo", new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString())
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
  document.querySelector("#back-from-edit").addEventListener("click", () => openView("all"));

  document.querySelectorAll("[data-variant]").forEach((button) => {
    button.addEventListener("click", () => {
      state.ui.homeVariant = button.dataset.variant;
      persist();
      syncLocationFromVariant();
      render();
    });
  });

  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => {
      state.ui.language = button.dataset.language;
      persist();
      render();
    });
  });

  sortSwitch.querySelectorAll("[data-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      state.ui.sortMode = button.dataset.sort;
      persist();
      render();
    });
  });

  scheduleForm.addEventListener("submit", (event) => handleRawSubmit(event, scheduleRaw, "schedule", "scheduleStatus"));
  todoForm.addEventListener("submit", (event) => handleRawSubmit(event, todoRaw, "todo", "todoStatus"));
  memoForm.addEventListener("submit", (event) => handleRawSubmit(event, memoRaw, "memo", "memoStatus"));
  editForm.addEventListener("submit", handleEditSubmit);
}

function handleRawSubmit(event, field, fallbackKind, statusKey) {
  event.preventDefault();
  const rawText = field.value.trim();
  if (!rawText) {
    state.ui[statusKey] = t("required");
    persist();
    renderStatuses();
    return;
  }

  state.items.push(enrichItemFromRaw(rawText, fallbackKind, getCurrentNow().toISOString()));
  field.value = "";
  state.ui[statusKey] = t("saved");
  persist();
  openView("home");
}

function handleEditSubmit(event) {
  event.preventDefault();
  const rawText = editRaw.value.trim();
  if (!rawText) {
    state.ui.editStatus = t("required");
    persist();
    renderStatuses();
    return;
  }

  if (!state.ui.editingItemId) {
    openView("all");
    return;
  }

  replaceItem(state.ui.editingItemId, rawText);
  state.ui.editingItemId = null;
  editRaw.value = "";
  state.ui.editStatus = t("updated");
  persist();
  openView("all");
}

function replaceItem(itemId, rawText) {
  state.items = state.items.map((item) => {
    if (item.id !== itemId) return item;
    const replacement = enrichItemFromRaw(rawText, item.kind, item.createdAt);
    replacement.id = item.id;
    replacement.completedAt = item.completedAt || null;
    replacement.reactionScore = item.reactionScore || 0;
    replacement.prompt = item.prompt || buildPromptMeta();
    replacement.workStage = item.workStage || "unstarted";
    replacement.previousScheduledAt = item.scheduledAt !== replacement.scheduledAt ? item.scheduledAt || null : item.previousScheduledAt || null;
    return replacement;
  });
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
    prepStartAt: parsed.prepStartAt,
    nextActionAt: parsed.nextActionAt,
    createdAt,
    completedAt: null,
    state: parsed.initialState,
    reactionScore: 0,
    classification: parsed.classification,
    prompt: buildPromptMeta(),
    workStage: "unstarted",
    previousScheduledAt: null,
    ambiguity: parsed.ambiguity,
  };
}

function buildPromptMeta() {
  return { lastPromptedAt: null, dismissCount: 0 };
}

function parseRawText(rawText, fallbackKind) {
  const normalized = rawText.replace(/\s+/g, " ").trim();
  const tokens = normalized ? normalized.split(" ") : [];
  const timeInfo = parseTimeToken(tokens);
  const dayInfo = parseDateToken(tokens);
  const actionInfo = parseActionToken(tokens);
  const filteredTokens = tokens.filter((token) => token !== timeInfo.token && token !== dayInfo.token);
  const titleToken = filteredTokens.find((token) => token !== actionInfo.token) || filteredTokens[0] || rawText;
  const supportTokens = filteredTokens.filter((token) => token !== titleToken && token !== actionInfo.token);

  const kind = inferKind(fallbackKind, rawText, actionInfo, timeInfo, dayInfo, tokens);
  const title = buildTitle(titleToken, actionInfo, kind);
  const support = buildSupport(supportTokens, actionInfo);
  const scheduledAt = buildScheduledAt(kind, timeInfo, dayInfo);
  const deadlineAt = buildDeadlineAt(kind, dayInfo);
  const prepStartAt = buildPrepStartAt(kind, scheduledAt, deadlineAt);
  const nextActionAt = buildNextActionAt(kind, scheduledAt, deadlineAt, prepStartAt);

  return {
    kind,
    title,
    support,
    action: actionInfo.token,
    tokens,
    scheduledAt,
    deadlineAt,
    prepStartAt,
    nextActionAt,
    ambiguity: dayInfo.ambiguity,
    initialState: inferInitialState(kind, dayInfo, scheduledAt, deadlineAt),
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
  return {
    token,
    hours: Number(token.replace("時半", "").replace("時", "")),
    minutes: token.includes("半") ? 30 : 0,
  };
}

function parseDateToken(tokens) {
  const now = getCurrentNow();
  const explicitDate = tokens.find((value) => /^\d{1,2}\/\d{1,2}$/.test(value));
  if (explicitDate) {
    const [month, day] = explicitDate.split("/").map(Number);
    return { token: explicitDate, date: new Date(now.getFullYear(), month - 1, day), certainty: "exact", ambiguity: null };
  }

  const token = tokens.find((value) =>
    ["今日", "明日", "来週金曜", "来週金曜日", "金", "金曜", "金曜日", "土", "土曜", "土曜日", "月", "月曜", "月曜日"].includes(value)
  );
  if (!token) return { token: "", date: null, certainty: "missing", ambiguity: null };
  if (token === "今日") return { token, date: stripTime(now), certainty: "exact", ambiguity: null };
  if (token === "明日") {
    const date = stripTime(now);
    date.setDate(date.getDate() + 1);
    return { token, date, certainty: "exact", ambiguity: null };
  }
  if (token === "来週金曜" || token === "来週金曜日") {
    return { token, date: buildUpcomingWeekdayDate(5, true), certainty: "exact", ambiguity: null };
  }
  return { token, date: null, certainty: "ambiguous", ambiguity: { type: "weekday_only", weekday: inferWeekdayFromToken(token) } };
}

function parseActionToken(tokens) {
  const actions = ["提出", "予約", "買い物", "準備", "確認", "展示"];
  return { token: tokens.find((value) => actions.includes(value)) || "" };
}

function inferKind(fallbackKind, rawText, actionInfo, timeInfo, dayInfo, tokens) {
  if (fallbackKind === "memo") return inferKindFromLearning(tokens) || "memo";
  if (timeInfo.token || rawText.includes("予約")) return "schedule";
  if (dayInfo.token || actionInfo.token === "提出" || fallbackKind === "todo") return "todo";
  return inferKindFromLearning(tokens) || "unknown";
}

function inferKindFromLearning(tokens) {
  const score = { schedule: 0, todo: 0, memo: 0 };
  tokens.forEach((token) => {
    const learned = state.userLearning.termKinds[token];
    if (!learned) return;
    Object.keys(score).forEach((kind) => {
      score[kind] += learned[kind] || 0;
    });
  });
  const winner = Object.entries(score).sort((a, b) => b[1] - a[1])[0];
  return winner && winner[1] > 0 ? winner[0] : null;
}

function buildTitle(titleToken, actionInfo, kind) {
  if (!titleToken) return "未分類";
  return kind === "todo" && actionInfo.token === "提出" ? `${titleToken}提出` : titleToken;
}

function buildSupport(supportTokens, actionInfo) {
  const parts = [];
  if (actionInfo.token && actionInfo.token !== "提出") parts.push(actionInfo.token);
  supportTokens.forEach((token) => parts.push(token));
  return parts.join(" ");
}

function buildScheduledAt(kind, timeInfo, dayInfo) {
  if (kind !== "schedule" || timeInfo.hours === null || dayInfo.certainty !== "exact") return null;
  const date = new Date(dayInfo.date);
  date.setHours(timeInfo.hours, timeInfo.minutes ?? 0, 0, 0);
  return toTokyoIso(date);
}

function buildDeadlineAt(kind, dayInfo) {
  if (kind !== "todo" || dayInfo.certainty !== "exact") return null;
  const date = new Date(dayInfo.date);
  date.setHours(18, 0, 0, 0);
  return toTokyoIso(date);
}

function buildPrepStartAt(kind, scheduledAt, deadlineAt) {
  if (kind === "schedule" && scheduledAt) return toTokyoIso(new Date(new Date(scheduledAt).getTime() - 45 * 60 * 1000));
  if (kind === "todo" && deadlineAt) return toTokyoIso(new Date(new Date(deadlineAt).getTime() - 24 * 60 * 60 * 1000));
  return null;
}

function buildNextActionAt(kind, scheduledAt, deadlineAt, prepStartAt) {
  if (kind === "schedule") return prepStartAt || scheduledAt;
  if (kind === "todo") return prepStartAt || deadlineAt || null;
  return null;
}

function inferInitialState(kind, dayInfo, scheduledAt, deadlineAt) {
  if (kind === "memo" || kind === "unknown") return STATES.INBOX;
  if (dayInfo.certainty === "ambiguous" || (kind === "schedule" && (!dayInfo.token || !scheduledAt))) return STATES.DATE_UNCONFIRMED;
  if (kind === "todo" && dayInfo.certainty === "missing") return STATES.NEED_INFO;
  if (!scheduledAt && !deadlineAt) return STATES.NEED_INFO;
  return deriveState({ kind, scheduledAt, deadlineAt, prepStartAt: buildPrepStartAt(kind, scheduledAt, deadlineAt), ambiguity: null, completedAt: null }, getCurrentNow().getTime());
}

function render() {
  refreshDynamicState();
  applyStaticTranslations();
  renderDate();
  renderViews();
  renderHomeVariant();
  renderVariantChrome();
  renderLanguageSwitch();
  renderFocusCards();
  renderNextCards();
  renderFab();
  renderStatuses();
  renderSortButtons();
  renderAllList();
}

function applyStaticTranslations() {
  document.documentElement.lang = state.ui.language === "ja" ? "ja" : "en";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder));
  });
}

function renderDate() {
  topDate.textContent = new Intl.DateTimeFormat(state.ui.language === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    timeZone: TOKYO_TIME_ZONE,
  }).format(getCurrentNow());
}

function renderViews() {
  const active = state.ui.activeView;
  homeView.classList.toggle("is-hidden", active !== "home");
  allView.classList.toggle("is-hidden", active !== "all");
  scheduleView.classList.toggle("is-hidden", active !== "schedule");
  todoView.classList.toggle("is-hidden", active !== "todo");
  memoView.classList.toggle("is-hidden", active !== "memo");
  editView.classList.toggle("is-hidden", active !== "edit");
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
}

function renderLanguageSwitch() {
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.language === state.ui.language);
  });
}

function refreshDynamicState() {
  const now = getCurrentNow().getTime();
  state.items.forEach((item) => {
    item.state = deriveState(item, now);
  });
  refreshBehaviorProfile();
  persist();
}

function refreshBehaviorProfile() {
  if (window.QuietLearningProfile) window.QuietLearningProfile.refresh(state);
}

function deriveState(item, now) {
  if (item.completedAt) return STATES.DONE;
  if (item.kind === "memo" || item.kind === "unknown") return STATES.INBOX;
  if (item.ambiguity || (item.kind === "schedule" && !item.scheduledAt)) return STATES.DATE_UNCONFIRMED;
  if (item.kind === "todo" && !item.deadlineAt) return STATES.NEED_INFO;
  const scheduled = item.scheduledAt ? new Date(item.scheduledAt).getTime() : null;
  const deadline = item.deadlineAt ? new Date(item.deadlineAt).getTime() : null;
  const prepStart = item.prepStartAt ? new Date(item.prepStartAt).getTime() : null;
  const anchor = scheduled || deadline;
  if (!anchor) return STATES.NEED_INFO;
  if (anchor <= now) return STATES.PAST_UNCONFIRMED;
  if (prepStart && prepStart <= now) return STATES.ACTION_NOW;
  return STATES.UPCOMING;
}

function renderFocusCards() {
  const focusItem = getFocusItem();
  rememberFocusPresentation(focusItem);
  renderFocusCardInto(focusCardA, focusTemplateA, focusItem, "A");
  renderFocusCardInto(focusCardB, focusTemplateB, focusItem, "B");
}

function rememberFocusPresentation(item) {
  if (!item || !window.QuietNotificationHistory) return;
  window.QuietNotificationHistory.recordPresentation(state, item, {
    channel: "home",
    messageText: buildFocusTitle(item),
    shownAt: getCurrentNow().toISOString(),
  });
  refreshBehaviorProfile();
}

function renderFocusCardInto(container, template, item, variant) {
  container.innerHTML = "";
  if (!item) {
    container.innerHTML = `<article class="focus-article"><p class="focus-time">${t("nowLabel")}</p><h1 class="focus-title">${t("homeEmptyTitle")}</h1><p class="focus-support">${t("homeEmptyMeta")}</p></article>`;
    return;
  }
  const fragment = template.content.cloneNode(true);
  fragment.querySelector(".focus-time").textContent = displayPrimaryTime(item);
  fragment.querySelector(".focus-title").textContent = buildFocusTitle(item);
  fragment.querySelector(".focus-support").textContent = displaySupport(item);
  const actions = fragment.querySelector(".focus-actions");
  buildFocusActions(item).forEach((action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = variant === "B" ? `focus-action focus-action-${action.kind}` : "focus-action focus-action-a";
    button.textContent = action.label;
    button.addEventListener("click", action.onClick);
    actions.appendChild(button);
  });
  container.appendChild(fragment);
}

function buildFocusTitle(item) {
  if (item.state === STATES.PAST_UNCONFIRMED) return `${item.title}\n${t("pastQuestion")}`;
  if (item.state === STATES.DATE_UNCONFIRMED) return `${item.title}\n${t("dateQuestion", { weekday: formatWeekdayName(item.ambiguity && item.ambiguity.weekday) })}`;
  if (item.state === STATES.INBOX) return `${item.title}\n${t("inboxQuestion")}`;
  return item.title;
}

function buildFocusActions(item) {
  if (item.state === STATES.PAST_UNCONFIRMED) {
    markPrompted(item);
    return [
      { label: t("doneAction"), kind: "primary", onClick: () => handleCompleteAction(item.id) },
      { label: t("rescheduleAction"), kind: "middle", onClick: () => sendToNeedInfo(item.id) },
      { label: t("changeTimeAction"), kind: "subtle", onClick: () => beginReschedule(item.id) },
    ];
  }
  if (item.state === STATES.DATE_UNCONFIRMED && item.ambiguity && item.ambiguity.type === "weekday_only") {
    const nextDate = buildUpcomingWeekdayDate(item.ambiguity.weekday, false);
    const followingDate = buildUpcomingWeekdayDate(item.ambiguity.weekday, true);
    return [
      { label: t("nextOption", { date: formatMonthDay(nextDate) }), kind: "primary", onClick: () => confirmDateChoice(item.id, nextDate) },
      { label: t("followingOption", { date: formatMonthDay(followingDate) }), kind: "middle", onClick: () => confirmDateChoice(item.id, followingDate) },
      { label: t("rewrite"), kind: "subtle", onClick: () => openEditView(item.id) },
    ];
  }
  if (item.state === STATES.INBOX) {
    markPrompted(item);
    return [
      { label: t("makeSchedule"), kind: "primary", onClick: () => classifyInboxItem(item.id, "schedule") },
      { label: t("research"), kind: "middle", onClick: () => classifyInboxItem(item.id, "todo") },
      { label: t("keepAsIs"), kind: "subtle", onClick: () => dismissInboxItem(item.id) },
    ];
  }
  return [];
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
  fragment.querySelector(".next-title").textContent = item ? item.title : t("nextEmptyTitle");
  fragment.querySelector(".next-support").textContent = item ? displaySupport(item) : "";
  container.appendChild(fragment);
}

function renderFab() {
  fabMenu.classList.toggle("is-hidden", !state.ui.fabOpen);
  fabButton.setAttribute("aria-expanded", String(state.ui.fabOpen));
}

function renderStatuses() {
  scheduleStatus.textContent = state.ui.scheduleStatus;
  todoStatus.textContent = state.ui.todoStatus;
  memoStatus.textContent = state.ui.memoStatus;
  editStatus.textContent = state.ui.editStatus;
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
    allList.innerHTML = `<p class="all-empty">${t("allEmpty")}</p>`;
    return;
  }
  items.forEach((item) => {
    const fragment = allItemTemplate.content.cloneNode(true);
    const article = fragment.querySelector(".all-item");
    const editButton = fragment.querySelector(".all-edit-link");
    fragment.querySelector(".all-time").textContent = displayPrimaryTime(item);
    fragment.querySelector(".all-title").textContent = item.title;
    fragment.querySelector(".all-support").textContent = displaySupport(item);
    editButton.textContent = t("rewrite");
    article.tabIndex = 0;
    article.setAttribute("role", "button");
    article.addEventListener("click", () => openEditView(item.id));
    article.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openEditView(item.id);
      }
    });
    editButton.addEventListener("click", (event) => {
      event.stopPropagation();
      openEditView(item.id);
    });
    allList.appendChild(fragment);
  });
}

function getFocusItem() {
  if (window.QuietNotificationSelector) {
    return window.QuietNotificationSelector.pickFocusItem(
      state.items,
      getCurrentNow().getTime(),
      state.userBehaviorProfile
    );
  }
  return state.items.filter((item) => item.state !== STATES.DONE).sort(compareByPriority)[0] || null;
}

function getNextScheduleItem() {
  const focusItem = getFocusItem();
  return state.items
    .filter((item) => item.kind === "schedule" && item.state === STATES.UPCOMING && item.id !== (focusItem && focusItem.id))
    .sort(compareByTime)[0] || null;
}

function getAllItemsSorted() {
  const items = state.items.slice().filter((item) => item.state !== STATES.DONE);
  return state.ui.sortMode === "time" ? items.sort(compareByTime) : items.sort(compareByPriority);
}

function compareByPriority(left, right) {
  if (window.QuietNotificationSelector) {
    return window.QuietNotificationSelector.compareByPriority(
      left,
      right,
      getCurrentNow().getTime(),
      state.userBehaviorProfile
    );
  }
  const diff = calculatePriorityScore(right) - calculatePriorityScore(left);
  return diff !== 0 ? diff : compareByTime(left, right);
}

function compareByTime(left, right) {
  const leftTime = getChronologicalValue(left);
  const rightTime = getChronologicalValue(right);
  if (leftTime === rightTime) return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
  return leftTime - rightTime;
}

function calculatePriorityScore(item) {
  if (window.QuietNotificationSelector) {
    return window.QuietNotificationSelector.computeItemScore(
      item,
      getCurrentNow().getTime(),
      state.userBehaviorProfile
    );
  }
  const weights = {
    [STATES.PAST_UNCONFIRMED]: 600,
    [STATES.ACTION_NOW]: 500,
    [STATES.UPCOMING]: 400,
    [STATES.INBOX]: 320,
    [STATES.DATE_UNCONFIRMED]: 250,
    [STATES.NEED_INFO]: 180,
    [STATES.DONE]: -999,
  };
  let score = weights[item.state] || 0;
  const now = getCurrentNow().getTime();
  const anchor = getChronologicalValue(item);
  if (anchor !== Number.MAX_SAFE_INTEGER) {
    const diff = anchor - now;
    if (diff <= 0) score += 120;
    else if (diff <= 60 * 60 * 1000) score += 90;
    else if (diff <= 24 * 60 * 60 * 1000) score += 45;
  }
  score -= ((item.prompt && item.prompt.dismissCount) || 0) * 8;
  score += item.reactionScore || 0;
  return score;
}

function getChronologicalValue(item) {
  const values = [item.prepStartAt, item.scheduledAt, item.deadlineAt, item.nextActionAt]
    .filter(Boolean)
    .map((value) => new Date(value).getTime())
    .sort((a, b) => a - b);
  return values[0] ?? Number.MAX_SAFE_INTEGER;
}

function displayPrimaryTime(item) {
  if (item.state === STATES.INBOX) return t("inboxLabel");
  if (item.state === STATES.DATE_UNCONFIRMED) return t("dateUnconfirmedLabel");
  if (item.state === STATES.NEED_INFO) return t("needsInfoLabel");
  if (item.scheduledAt) return formatScheduledDisplay(item.scheduledAt);
  if (item.deadlineAt) return formatScheduledDisplay(item.deadlineAt);
  if (item.nextActionAt) return formatScheduledDisplay(item.nextActionAt);
  return t("nowLabel");
}

function displaySupport(item) {
  if (item.state === STATES.PAST_UNCONFIRMED) return item.support || item.rawText;
  if (item.state === STATES.INBOX) return item.support || item.rawText;
  if (item.state === STATES.DATE_UNCONFIRMED) return t("dateUnconfirmedSupport");
  if (item.support) return item.support;
  if (item.state === STATES.NEED_INFO) return t("needInfoSupport");
  return item.rawText || "";
}

function classifyInboxItem(itemId, nextKind) {
  const item = findItem(itemId);
  if (!item) return;
  item.kind = nextKind;
  item.classification = nextKind;
  item.reactionScore += 12;
  item.prompt.dismissCount = 0;
  recordClassificationLearning(item, nextKind);
  if (nextKind === "schedule") {
    item.state = STATES.DATE_UNCONFIRMED;
    item.ambiguity = item.ambiguity || { type: "needs_date" };
  } else if (nextKind === "todo") {
    item.state = STATES.NEED_INFO;
  }
  persist();
  render();
}

function dismissInboxItem(itemId) {
  const item = findItem(itemId);
  if (!item) return;
  item.prompt.dismissCount += 1;
  item.prompt.lastPromptedAt = getCurrentNow().toISOString();
  if (window.QuietNotificationHistory) {
    window.QuietNotificationHistory.markAction(state, itemId, "dismiss", getCurrentNow().toISOString());
    refreshBehaviorProfile();
  }
  persist();
  render();
}

function recordClassificationLearning(item, selectedKind) {
  if (window.QuietLearningProfile) {
    window.QuietLearningProfile.recordClassificationCorrection(state, item, selectedKind);
    refreshBehaviorProfile();
    return;
  }
  item.tokens.filter((token) => token && token.length >= 2).forEach((term) => {
    const current = state.userLearning.termKinds[term] || { schedule: 0, todo: 0, memo: 0 };
    current[selectedKind] = (current[selectedKind] || 0) + 1;
    state.userLearning.termKinds[term] = current;
  });
  state.userLearning.history.push({
    itemId: item.id,
    rawText: item.rawText,
    selectedKind,
    recordedAt: getCurrentNow().toISOString(),
  });
}

function confirmDateChoice(itemId, date) {
  const item = findItem(itemId);
  if (!item) return;
  if (item.kind === "schedule") {
    const base = item.scheduledAt ? new Date(item.scheduledAt) : new Date(date);
    if (!item.scheduledAt) base.setHours(9, 0, 0, 0);
    base.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    item.scheduledAt = toTokyoIso(base);
  } else if (item.kind === "todo") {
    const deadline = new Date(date);
    deadline.setHours(18, 0, 0, 0);
    item.deadlineAt = toTokyoIso(deadline);
  }
  item.ambiguity = null;
  item.prepStartAt = buildPrepStartAt(item.kind, item.scheduledAt, item.deadlineAt);
  item.nextActionAt = buildNextActionAt(item.kind, item.scheduledAt, item.deadlineAt, item.prepStartAt);
  item.state = deriveState(item, getCurrentNow().getTime());
  item.reactionScore += 6;
  persist();
  render();
}

function sendToNeedInfo(itemId) {
  const item = findItem(itemId);
  if (!item) return;
  item.state = item.kind === "schedule" ? STATES.DATE_UNCONFIRMED : STATES.NEED_INFO;
  item.deadlineAt = null;
  item.scheduledAt = null;
  item.prepStartAt = null;
  item.nextActionAt = null;
  item.prompt.dismissCount += 1;
  if (window.QuietNotificationHistory) {
    window.QuietNotificationHistory.markAction(state, itemId, "reschedule", getCurrentNow().toISOString());
    refreshBehaviorProfile();
  }
  persist();
  render();
}

function beginReschedule(itemId) {
  openEditView(itemId);
  const item = findItem(itemId);
  if (!item) return;
  item.prompt.dismissCount += 1;
  if (window.QuietNotificationHistory) {
    window.QuietNotificationHistory.markAction(state, itemId, "reschedule", getCurrentNow().toISOString());
    refreshBehaviorProfile();
  }
  persist();
}

function openEditView(itemId) {
  const item = findItem(itemId);
  if (!item) return;
  state.ui.editingItemId = itemId;
  state.ui.editStatus = "";
  editRaw.value = item.rawText;
  persist();
  openView("edit");
}

function handleCompleteAction(itemId) {
  if (state.ui.homeVariant !== "B") {
    markDone(itemId);
    return;
  }
  playCompletionAnimation(document.querySelector("#focus-card-b .focus-article-b"), () => markDone(itemId));
}

function markDone(itemId) {
  const item = findItem(itemId);
  if (!item) return;
  item.state = STATES.DONE;
  item.completedAt = getCurrentNow().toISOString();
  if (window.QuietNotificationHistory) {
    window.QuietNotificationHistory.markAction(state, itemId, "done", item.completedAt);
    refreshBehaviorProfile();
  }
  persist();
  render();
}

function playCompletionAnimation(targetNode, onComplete) {
  if (!targetNode) {
    onComplete();
    return;
  }
  const icon = state.ui.completionMode === "trash" ? completionIconTrash : completionIconArchive;
  const otherIcon = state.ui.completionMode === "trash" ? completionIconArchive : completionIconTrash;
  otherIcon.classList.add("is-hidden");
  icon.classList.remove("is-hidden");
  completionSignal.classList.remove("is-hidden");
  completionSignal.classList.add("is-active");
  targetNode.classList.add("is-completing");
  window.setTimeout(() => {
    targetNode.classList.remove("is-completing");
    completionSignal.classList.remove("is-active");
    completionSignal.classList.add("is-hidden");
    icon.classList.add("is-hidden");
    onComplete();
  }, 420);
}

function markPrompted(item) {
  if (!shouldPromptItem(item)) return;
  item.prompt.lastPromptedAt = getCurrentNow().toISOString();
  persist();
}

function shouldPromptItem(item) {
  const last = item.prompt.lastPromptedAt ? new Date(item.prompt.lastPromptedAt).getTime() : 0;
  if (!last) return true;
  const interval = item.state === STATES.INBOX ? 24 * 60 * 60 * 1000 : 12 * 60 * 60 * 1000;
  return getCurrentNow().getTime() - last >= interval;
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
  if (viewName === "edit") editRaw.focus();
}

function clearStatuses() {
  state.ui.scheduleStatus = "";
  state.ui.todoStatus = "";
  state.ui.memoStatus = "";
  state.ui.editStatus = "";
}

function findItem(itemId) {
  return state.items.find((item) => item.id === itemId);
}

function syncVariantFromLocation() {
  const params = new URLSearchParams(window.location.search);
  const variant = (params.get("variant") || "").toUpperCase();
  if (variant === "A" || variant === "B") state.ui.homeVariant = variant;
}

function syncCompletionModeFromLocation() {
  const params = new URLSearchParams(window.location.search);
  const mode = (params.get("complete") || "").toLowerCase();
  if (mode === "trash" || mode === "archive") state.ui.completionMode = mode;
}

function syncLocationFromVariant() {
  const params = new URLSearchParams(window.location.search);
  params.set("variant", state.ui.homeVariant.toLowerCase());
  window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
}

function formatScheduledDisplay(value) {
  const date = new Date(value);
  const locale = state.ui.language === "ja" ? "ja-JP" : "en-US";
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: TOKYO_TIME_ZONE }).format(date);
  return `${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${weekday}\n${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatMonthDay(date) {
  return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
}

function formatWeekdayName(weekday) {
  const ja = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
  const en = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return (state.ui.language === "ja" ? ja : en)[weekday ?? 5];
}

function inferWeekdayFromToken(token) {
  if (["日", "日曜", "日曜日"].includes(token)) return 0;
  if (["月", "月曜", "月曜日"].includes(token)) return 1;
  if (["金", "金曜", "金曜日"].includes(token)) return 5;
  if (["土", "土曜", "土曜日"].includes(token)) return 6;
  return 5;
}

function buildUpcomingWeekdayDate(weekday, followingWeek) {
  const base = stripTime(getCurrentNow());
  let diff = (weekday - base.getDay() + 7) % 7;
  if (diff === 0) diff = 7;
  if (followingWeek) diff += 7;
  base.setDate(base.getDate() + diff);
  return base;
}

function getCurrentNow() {
  return new Date();
}

function toTokyoIso(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00+09:00`;
}

function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
  return `item-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function pad(value) {
  return String(value).padStart(2, "0");
}
