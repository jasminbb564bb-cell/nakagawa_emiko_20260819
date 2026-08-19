const STORAGE_KEY = "quiet-todo-flow-v4";
const BASE_NOW = new Date("2026-08-19T12:00:00+09:00");

const T = {
  intro1: "\u601d\u3044\u3064\u3044\u305f\u8a00\u8449\u3092\u3001",
  intro1b: "\u30b9\u30da\u30fc\u30b9\u3067\u533a\u5207\u3063\u3066\u5165\u308c\u308b\u3060\u3051\u3002",
  intro2: "\u3042\u3068\u306f\u3001\u3053\u3061\u3089\u3067\u6574\u7406\u3057\u3066\u3001",
  intro2b: "\u5fc5\u8981\u306a\u3068\u304d\u306b\u304a\u77e5\u3089\u305b\u3057\u307e\u3059\u3002",
  intro3: "\u4f7f\u3046\u307b\u3069\u3001",
  intro3b: "\u3042\u306a\u305f\u306e\u4e88\u5b9a\u3092\u308f\u304b\u3063\u3066\u304f\u308c\u308b",
  intro3c: "\u5c0f\u3055\u306a\u79d8\u66f8\u306b\u306a\u308a\u307e\u3059\u3002",
  inputGuide1: "\u601d\u3044\u3064\u3044\u305f\u3053\u3068\u3092\u3001\u305d\u306e\u307e\u307e\u66f8\u3044\u3066\u304f\u3060\u3055\u3044\u3002",
  inputGuide2: "\u6574\u7406\u306f\u3042\u3068\u3067\u5927\u4e08\u592b\u3067\u3059\u3002",
  emptyInput: "\u7a7a\u767d\u306e\u307e\u307e\u3067\u306f\u9810\u3051\u3089\u308c\u307e\u305b\u3093\u3002",
  saved: "\u4fdd\u5b58\u3057\u307e\u3057\u305f",
  savedSoft: "\u3044\u3063\u305f\u3093\u9810\u304b\u308a\u307e\u3057\u305f\u3002\u4eca\u304b\u3001\u3042\u3068\u3067\u304b\u3060\u3051\u6c7a\u3081\u308c\u3070\u5927\u4e08\u592b\u3067\u3059\u3002",
  laterSaved: "\u3042\u3068\u3067\u306b\u3057\u307e\u3057\u305f\u3002\u5fc5\u8981\u306a\u6642\u306b\u3001\u3053\u3061\u3089\u304b\u3089\u3082\u3046\u4e00\u5ea6\u51fa\u3057\u307e\u3059\u3002",
  choiceGuide: "\u300c\u4eca\u300d \u4eca\u3059\u3050\u8003\u3048\u305f\u308a\u52d5\u3044\u305f\u308a\u3059\u308b\u3082\u306e<br />\u300c\u3042\u3068\u3067\u300d \u4eca\u306f\u5fd8\u308c\u3066\u5927\u4e08\u592b\u3067\u3059\u3002\u5fc5\u8981\u306a\u6642\u306b\u30a2\u30d7\u30ea\u304c\u3082\u3046\u4e00\u5ea6\u51fa\u3057\u307e\u3059\u3002",
  noFocusTitle: "\u307e\u3060\u4f55\u3082\u6025\u304c\u306a\u304f\u3066\u5927\u4e08\u592b\u3067\u3059\u3002",
  noFocusCopy: "\u601d\u3044\u3064\u3044\u305f\u3053\u3068\u3092\u9810\u3051\u3066\u304a\u3051\u3070\u3001\u5fc5\u8981\u306a\u6642\u306b\u3053\u3061\u3089\u304b\u3089\u8fd4\u3057\u307e\u3059\u3002",
  nowHeader: "\u4eca\u3001\u3059\u308b\u3053\u3068",
  afterGuide: "\u7d42\u308f\u3063\u305f\u3089\u300c\u5b8c\u4e86\u300d\u306b\u3057\u3066\u304f\u3060\u3055\u3044\u3002\u307e\u3060\u7d42\u308f\u3063\u3066\u3044\u306a\u3051\u308c\u3070\u3001\u305d\u306e\u307e\u307e\u6b8b\u305b\u307e\u3059\u3002",
  returnedGuide: "\u524d\u306b\u300c\u3042\u3068\u3067\u300d\u306b\u3057\u305f\u3082\u306e\u3067\u3059\u3002\u305d\u308d\u305d\u308d\u78ba\u8a8d\u3059\u308b\u6642\u9593\u306a\u306e\u3067\u623b\u3057\u307e\u3057\u305f\u3002",
  done: "\u5b8c\u4e86\u3057\u307e\u3057\u305f",
  askLater: "\u5c11\u3057\u3042\u3068\u3067\u3001\u3082\u3046\u4e00\u5ea6\u305f\u305a\u306d\u307e\u3059\u3002",
  allEmpty: "\u8868\u793a\u3067\u304d\u308b\u4e88\u5b9a\u306f\u3042\u308a\u307e\u305b\u3093\u3002",
  laterEmpty: "\u4eca\u306f\u3042\u308a\u307e\u305b\u3093\u3002",
  deleteConfirm: "\u3053\u306e\u4e88\u5b9a\u3092\u524a\u9664\u3057\u307e\u3059\u304b\uff1f",
  deleted: "\u524a\u9664\u3057\u307e\u3057\u305f",
  testLabel: "\u958b\u767a\u78ba\u8a8d\u7528",
  testNormal: "\u901a\u5e38",
  test30: "30\u5206\u524d",
  testSoon: "\u76f4\u524d",
  testAfter: "\u4e88\u5b9a\u5f8c",
  allInputText: "\u5165\u529b\u3057\u305f\u6587",
  titleLabel: "\u30bf\u30a4\u30c8\u30eb",
  dateTimeLabel: "\u65e5\u6642",
  statusLabel: "\u72b6\u614b",
  nextLabel: "\u6b21\u306b\u8868\u793a",
  snoozeLabel: "\u5ef6\u671f\u3057\u305f\u56de\u6570",
  completeLabel: "\u5b8c\u4e86",
  doneState: "\u6e08\u307f",
  notDoneState: "\u672a\u5b8c\u4e86",
  undatedCopy: "\u65e5\u4ed8\u304c\u307e\u3060\u6c7a\u307e\u3063\u3066\u3044\u307e\u305b\u3093\u3002\u3044\u307e\u6c7a\u3081\u306a\u304f\u3066\u3082\u5927\u4e08\u592b\u3067\u3059\u3002",
  futureCopy: "\u307e\u3060\u5148\u306a\u306e\u3067\u3001\u4eca\u306f\u4f55\u3082\u3057\u306a\u304f\u3066\u5927\u4e08\u592b\u3067\u3059\u3002",
  actionNow: "\u3084\u308b",
  actionLater: "\u3042\u3068\u3067",
  actionDone: "\u5b8c\u4e86",
  actionNotYet: "\u307e\u3060",
  actionShowNow: "\u4eca\u898b\u308b",
  waiting: "\u5f85\u6a5f\u4e2d",
  later: "\u3042\u3068\u3067",
  current: "\u4eca",
  completed: "\u5b8c\u4e86",
  inbox: "\u672a\u6574\u7406",
};

const state = loadState();

const topDate = document.querySelector("#top-date");
const heroIntroCopy = document.querySelector(".hero-intro-copy");
const focusCard = document.querySelector("#focus-card");
const laterToggle = document.querySelector("#later-toggle");
const allToggle = document.querySelector("#all-toggle");
const inputGuide = document.querySelector("#input-guide");
const input = document.querySelector("#quick-input");
const createTaskButton = document.querySelector("#create-task");
const inputStatus = document.querySelector("#input-status");
const choicePanel = document.querySelector("#choice-panel");
const choiceCard = document.querySelector("#choice-card");
const laterPanel = document.querySelector("#later-panel");
const laterList = document.querySelector("#later-list");
const mainView = document.querySelector("#main-view");
const allView = document.querySelector("#all-view");
const backToMain = document.querySelector("#back-to-main");
const filterRow = document.querySelector("#filter-row");
const allList = document.querySelector("#all-list");
const debugToggle = document.querySelector("#debug-toggle");
const debugJson = document.querySelector("#debug-json");

const focusTemplate = document.querySelector("#focus-template");
const choiceTemplate = document.querySelector("#choice-template");
const laterItemTemplate = document.querySelector("#later-item-template");
const allItemTemplate = document.querySelector("#all-item-template");

boot();

function boot() {
  seedIfEmpty();
  bindEvents();
  refreshStatuses();
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
    tasks: [],
    pendingChoiceTaskId: null,
    ui: {
      inputStatus: T.inputGuide1,
      showLaterList: false,
      showAllView: false,
      activeFilter: "all",
      showDebugJson: false,
      testNowMode: "realtime",
      hintsSeen: {
        input: false,
        choiceMeaning: false,
        laterReturned: false,
        completion: false,
      },
    },
  };
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function seedIfEmpty() {
  if (state.tasks.length > 0) return;
  const sample = buildTask("\u7f8e\u5bb9\u9662 8\u670822\u65e5 17\u6642");
  sample.status = "later";
  sample.nextActionAt = new Date("2026-08-21T09:00:00+09:00").toISOString();
  state.tasks.push(sample);
  persist();
}

function bindEvents() {
  createTaskButton.addEventListener("click", handleCreateTask);
  laterToggle.addEventListener("click", () => {
    state.ui.showLaterList = !state.ui.showLaterList;
    persist();
    renderLaterList();
  });
  allToggle.addEventListener("click", () => {
    state.ui.showAllView = true;
    persist();
    renderViewMode();
    renderAllList();
  });
  backToMain.addEventListener("click", () => {
    state.ui.showAllView = false;
    persist();
    renderViewMode();
  });
  filterRow.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.ui.activeFilter = button.dataset.filter;
      persist();
      renderAllList();
    });
  });
  debugToggle.addEventListener("click", () => {
    state.ui.showDebugJson = !state.ui.showDebugJson;
    persist();
    renderDebugJson();
  });
}

function handleCreateTask() {
  const rawText = input.value.trim();
  if (!rawText) {
    state.ui.inputStatus = T.emptyInput;
    persist();
    renderInputStatus();
    return;
  }

  const task = buildTask(rawText);
  state.tasks.unshift(task);
  state.pendingChoiceTaskId = task.id;
  state.ui.inputStatus = T.saved;
  state.ui.hintsSeen.input = true;
  input.value = "";
  persist();
  refreshStatuses();
  render();

  window.setTimeout(() => {
    if (state.ui.inputStatus === T.saved) {
      state.ui.inputStatus = T.savedSoft;
      persist();
      renderInputStatus();
    }
  }, 1600);
}

function buildTask(rawText) {
  const parsed = parseDateTime(rawText);
  const now = getCurrentNow();
  return {
    id: createId(),
    rawText,
    title: parsed.title || rawText,
    date: parsed.dateIso,
    time: parsed.timeText,
    scheduledAt: parsed.scheduledAt,
    status: "inbox",
    createdAt: now.toISOString(),
    nextActionAt: now.toISOString(),
    snoozeCount: 0,
    completedAt: null,
    lastShownAt: null,
    shownFromLater: false,
  };
}

function parseDateTime(text) {
  const normalized = normalizeText(text);
  const time = parseTime(normalized);
  const date = parseDate(normalized);
  let title = text;
  if (time) title = title.replace(time.rawOriginal, " ");
  if (date) title = title.replace(date.rawOriginal, " ");
  title = title.replace(/\s+/g, " ").trim();

  let scheduledAt = null;
  let dateIso = null;
  let timeText = null;

  if (date) {
    const target = new Date(date.date);
    target.setHours(time ? time.hours : 9, time ? time.minutes : 0, 0, 0);
    scheduledAt = target.toISOString();
    dateIso = isoDate(target);
  }

  if (time) {
    timeText = `${pad(time.hours)}:${pad(time.minutes)}`;
  }

  return { title, dateIso, timeText, scheduledAt };
}

function normalizeText(text) {
  return text
    .replace(/\u4e94\u6642/g, "5\u6642")
    .replace(/\u516b\u6708/g, "8\u6708")
    .replace(/\s+/g, " ")
    .trim();
}

function parseDate(text) {
  const relative = [
    { word: "\u4eca\u65e5", days: 0 },
    { word: "\u660e\u5f8c\u65e5", days: 2 },
    { word: "\u660e\u65e5", days: 1 },
  ];

  for (const item of relative) {
    if (text.includes(item.word)) {
      const date = new Date(BASE_NOW);
      date.setDate(date.getDate() + item.days);
      return { rawOriginal: item.word, date };
    }
  }

  const dayAfter = text.match(/(\d{1,2})\u65e5\u5f8c/);
  if (dayAfter) {
    const date = new Date(BASE_NOW);
    date.setDate(date.getDate() + Number(dayAfter[1]));
    return { rawOriginal: dayAfter[0], date };
  }

  const md = text.match(/(\d{1,2})\u6708(\d{1,2})\u65e5/);
  if (md) {
    const month = Number(md[1]);
    const day = Number(md[2]);
    const year = inferYear(month, day);
    return {
      rawOriginal: md[0],
      date: new Date(`${year}-${pad(month)}-${pad(day)}T09:00:00+09:00`),
    };
  }

  const slash = text.match(/(\d{1,2})\/(\d{1,2})/);
  if (slash) {
    const month = Number(slash[1]);
    const day = Number(slash[2]);
    const year = inferYear(month, day);
    return {
      rawOriginal: slash[0],
      date: new Date(`${year}-${pad(month)}-${pad(day)}T09:00:00+09:00`),
    };
  }

  return null;
}

function parseTime(text) {
  const colon = text.match(/(\u5348\u524d|\u5348\u5f8c)?\s*(\d{1,2})[:\uff1a](\d{1,2})/);
  if (colon) {
    return {
      rawOriginal: colon[0],
      hours: to24h(colon[1], Number(colon[2])),
      minutes: Number(colon[3]),
    };
  }

  const hour = text.match(/(\u5348\u524d|\u5348\u5f8c)?\s*(\d{1,2})\u6642(\u534a)?/);
  if (hour) {
    return {
      rawOriginal: hour[0],
      hours: to24h(hour[1], Number(hour[2])),
      minutes: hour[3] ? 30 : 0,
    };
  }

  return null;
}

function to24h(ampm, hour) {
  if (ampm === "\u5348\u5f8c" && hour < 12) return hour + 12;
  if (ampm === "\u5348\u524d" && hour === 12) return 0;
  return hour;
}

function inferYear(month, day) {
  const year = 2026;
  const candidate = new Date(`${year}-${pad(month)}-${pad(day)}T00:00:00+09:00`);
  const base = new Date("2026-08-19T00:00:00+09:00");
  return candidate.getTime() < base.getTime() ? 2027 : 2026;
}

function refreshStatuses() {
  const now = getCurrentNow().getTime();
  state.tasks.forEach((task) => {
    if (task.status === "completed" || task.status === "inbox") return;

    if (isPastDueTask(task, now)) {
      task.status = "now";
      return;
    }

    if (task.nextActionAt && new Date(task.nextActionAt).getTime() <= now) {
      task.status = "now";
      return;
    }

    if (!task.scheduledAt) {
      task.status = "later";
      return;
    }

    const scheduled = new Date(task.scheduledAt).getTime();
    const diffMinutes = (scheduled - now) / 60000;
    if (diffMinutes <= 120 || sameDay(scheduled, now)) {
      task.status = "now";
    } else if (task.status !== "later") {
      task.status = "waiting";
    }
  });
  persist();
}

function render() {
  renderDate();
  renderIntro();
  renderInputGuide();
  renderInputStatus();
  renderChoicePanel();
  renderFocusCard();
  renderLaterToggle();
  renderLaterList();
  renderViewMode();
  renderAllList();
  renderDebugJson();
}

function renderDate() {
  topDate.textContent = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(BASE_NOW);
}

function renderIntro() {
  heroIntroCopy.innerHTML = `
    <p class="hero-intro-main">${T.intro1}<br />${T.intro1b}</p>
    <p class="hero-intro-sub">${T.intro2}<br />${T.intro2b}</p>
    <p class="hero-intro-sub">${T.intro3}<br /><span class="hero-intro-emphasis">${T.intro3b}</span><br /><span class="hero-intro-emphasis">${T.intro3c}</span></p>
  `;
}

function renderInputGuide() {
  if (state.ui.hintsSeen.input) {
    inputGuide.textContent = "";
    inputGuide.classList.add("is-hidden");
    return;
  }
  inputGuide.innerHTML = `${T.inputGuide1}<br />${T.inputGuide2}`;
  inputGuide.classList.remove("is-hidden");
}

function renderInputStatus() {
  inputStatus.textContent = state.ui.inputStatus;
}

function renderChoicePanel() {
  const task = state.tasks.find((item) => item.id === state.pendingChoiceTaskId);
  if (!task) {
    choicePanel.classList.add("is-hidden");
    choiceCard.innerHTML = "";
    return;
  }

  choicePanel.classList.remove("is-hidden");
  choiceCard.innerHTML = "";
  const fragment = choiceTemplate.content.cloneNode(true);
  fragment.querySelector(".choice-title").textContent = task.title;
  fragment.querySelector(".task-copy").textContent = buildChoiceCopy(task);

  const guide = fragment.querySelector("#choice-guide");
  if (!state.ui.hintsSeen.choiceMeaning) {
    guide.innerHTML = T.choiceGuide;
    guide.classList.remove("is-hidden");
  }

  fragment.querySelectorAll("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => handleChoice(task.id, button.dataset.choice));
  });
  choiceCard.appendChild(fragment);
}

function handleChoice(taskId, choice) {
  const task = findTask(taskId);
  if (!task) return;

  const now = getCurrentNow();
  if (choice === "now") {
    task.status = "now";
    task.nextActionAt = now.toISOString();
    state.ui.inputStatus = "\u4eca\u3059\u308b\u3053\u3068\u306b\u51fa\u3057\u307e\u3057\u305f";
  } else if (choice === "later") {
    task.status = task.scheduledAt ? "waiting" : "later";
    task.nextActionAt = calculateNextActionAt(task, now);
    task.shownFromLater = false;
    state.ui.inputStatus = T.laterSaved;
  } else {
    task.status = "later";
    task.nextActionAt = new Date(now.getTime() + 60 * 1000).toISOString();
    task.shownFromLater = false;
    state.ui.inputStatus = "1\u5206\u5f8c\u306b\u3082\u3046\u4e00\u5ea6\u51fa\u3059\u3088\u3046\u306b\u3057\u307e\u3057\u305f";
  }

  state.ui.hintsSeen.choiceMeaning = true;
  state.pendingChoiceTaskId = null;
  persist();
  refreshStatuses();
  render();
}

function calculateNextActionAt(task, now) {
  if (!task.scheduledAt) {
    return new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString();
  }
  const scheduled = new Date(task.scheduledAt);
  const dayBefore = new Date(scheduled.getTime() - 24 * 60 * 60 * 1000);
  const ninetyBefore = new Date(scheduled.getTime() - 90 * 60 * 1000);
  if (dayBefore.getTime() > now.getTime()) return dayBefore.toISOString();
  if (ninetyBefore.getTime() > now.getTime()) return ninetyBefore.toISOString();
  return new Date(now.getTime() + 60 * 60 * 1000).toISOString();
}

function getFocusTask() {
  const candidates = state.tasks.filter((task) => task.status !== "completed" && task.id !== state.pendingChoiceTaskId);
  if (candidates.length === 0) return null;
  return candidates
    .map((task) => ({ task, score: scoreTask(task) }))
    .sort((a, b) => b.score - a.score)[0].task;
}

function scoreTask(task) {
  const now = getCurrentNow().getTime();
  let score = 0;
  if (isPastDueTask(task, now)) score += 20000;
  if (task.scheduledAt) {
    const scheduled = new Date(task.scheduledAt).getTime();
    if (sameDay(scheduled, now)) score += 4000;
    const diffMinutes = (scheduled - now) / 60000;
    if (diffMinutes > 0 && diffMinutes <= 120) score += 7000 - diffMinutes;
  }
  if (task.status === "now") score += 5000;
  if (task.nextActionAt && new Date(task.nextActionAt).getTime() <= now) score += 3000;
  if (task.status === "later") score += 1200;
  if (task.status === "waiting") score += 900;
  score += task.snoozeCount * 120;
  return score;
}

function renderFocusCard() {
  focusCard.innerHTML = "";
  const task = getFocusTask();
  if (!task) {
    focusCard.innerHTML = `<article class="task-card"><p class="task-kicker">${T.nowHeader}</p><h1 class="task-title">${T.noFocusTitle}</h1><p class="task-copy">${T.noFocusCopy}</p></article>`;
    return;
  }

  const view = describeTaskView(task);
  const fragment = focusTemplate.content.cloneNode(true);
  fragment.querySelector(".task-kicker").textContent = view.kicker;
  fragment.querySelector(".task-time").textContent = view.time;
  fragment.querySelector(".task-title").textContent = view.title;
  fragment.querySelector(".task-copy").textContent = view.copy;

  const guide = fragment.querySelector(".inline-guide");
  const guideText = buildContextGuide(task, view.mode);
  if (guideText) {
    guide.textContent = guideText;
    guide.classList.remove("is-hidden");
  }

  const actions = fragment.querySelector(".task-actions");
  buildFocusActions(task, view.mode).forEach((action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "text-button";
    button.textContent = action.label;
    button.addEventListener("click", action.onClick);
    actions.appendChild(button);
  });
  actions.appendChild(buildTestControls());

  task.lastShownAt = getCurrentNow().toISOString();
  focusCard.appendChild(fragment);
  persist();
}

function describeTaskView(task) {
  if (!task.scheduledAt) {
    return { mode: "undated", kicker: T.nowHeader, time: "", title: task.title, copy: T.undatedCopy };
  }

  const now = getCurrentNow().getTime();
  const scheduled = new Date(task.scheduledAt).getTime();
  const diffMinutes = Math.round((scheduled - now) / 60000);

  if (isPastDueTask(task, now)) {
    return {
      mode: "after-event",
      kicker: T.nowHeader,
      time: buildScheduleLabel(task),
      title: `${task.title}\u306f\u7d42\u308f\u308a\u307e\u3057\u305f\u304b\uff1f`,
      copy: "",
    };
  }

  if (diffMinutes <= 120) {
    return {
      mode: "soon",
      kicker: T.nowHeader,
      time: buildScheduleLabel(task),
      title: task.title,
      copy: `${task.title}\u307e\u3067\u3001\u3042\u3068${formatRelativeMinutes(diffMinutes)}\u3002\u305d\u308d\u305d\u308d\u51fa\u308b\u6e96\u5099\u3092\u3002`,
    };
  }

  if (sameDay(scheduled, now)) {
    return {
      mode: "today",
      kicker: T.nowHeader,
      time: buildScheduleLabel(task),
      title: task.title,
      copy: `${normalizeTimeLabel(task)}\u307e\u3067\u306f\u3001\u307e\u3060\u6642\u9593\u304c\u3042\u308a\u307e\u3059\u3002`,
    };
  }

  return {
    mode: "future",
    kicker: T.nowHeader,
    time: buildScheduleLabel(task),
    title: task.title,
    copy: T.futureCopy,
  };
}

function buildContextGuide(task, mode) {
  if (task.shownFromLater && !state.ui.hintsSeen.laterReturned) {
    state.ui.hintsSeen.laterReturned = true;
    persist();
    return T.returnedGuide;
  }
  if (mode === "after-event" && !state.ui.hintsSeen.completion) {
    state.ui.hintsSeen.completion = true;
    persist();
    return T.afterGuide;
  }
  return "";
}

function buildFocusActions(task, mode) {
  if (mode === "after-event") {
    return [
      { label: T.actionDone, onClick: () => completeTask(task.id) },
      { label: T.actionNotYet, onClick: () => snoozeTask(task.id, 1, T.askLater) },
    ];
  }
  return [
    { label: T.actionNow, onClick: () => markNow(task.id) },
    { label: T.actionLater, onClick: () => deferTask(task.id) },
  ];
}

function buildTestControls() {
  const wrapper = document.createElement("div");
  wrapper.className = "developer-area";
  wrapper.innerHTML = `
    <p class="record-meta">${T.testLabel}</p>
    <div class="filter-row">
      <button class="filter-chip ${state.ui.testNowMode === "realtime" ? "is-active" : ""}" type="button" data-test-now="realtime">${T.testNormal}</button>
      <button class="filter-chip ${state.ui.testNowMode === "minus30" ? "is-active" : ""}" type="button" data-test-now="minus30">${T.test30}</button>
      <button class="filter-chip ${state.ui.testNowMode === "before5" ? "is-active" : ""}" type="button" data-test-now="before5">${T.testSoon}</button>
      <button class="filter-chip ${state.ui.testNowMode === "after10" ? "is-active" : ""}" type="button" data-test-now="after10">${T.testAfter}</button>
    </div>
  `;
  wrapper.querySelectorAll("[data-test-now]").forEach((button) => {
    button.addEventListener("click", () => {
      state.ui.testNowMode = button.dataset.testNow;
      persist();
      refreshStatuses();
      render();
    });
  });
  return wrapper;
}

function markNow(taskId) {
  const task = findTask(taskId);
  if (!task) return;
  task.status = "now";
  task.nextActionAt = getCurrentNow().toISOString();
  task.shownFromLater = false;
  state.ui.inputStatus = "\u4eca\u3059\u308b\u3053\u3068\u3068\u3057\u3066\u524d\u306b\u51fa\u3057\u307e\u3057\u305f";
  persist();
  render();
}

function deferTask(taskId) {
  const task = findTask(taskId);
  if (!task) return;
  task.snoozeCount += 1;
  task.status = "later";
  task.nextActionAt = calculateDeferredTime(task).toISOString();
  task.shownFromLater = false;
  state.ui.inputStatus =
    task.snoozeCount >= 3
      ? `\u3053\u308c\u3001\u307e\u3060\u6b8b\u3063\u3066\u3044\u307e\u3059\u3002${task.title}\u306e\u3053\u3068\u3092\u6c7a\u3081\u307e\u3059\u304b\u3002`
      : "\u4eca\u306f\u9589\u3058\u3066\u304a\u304d\u307e\u3059\u3002\u5fc5\u8981\u306a\u6642\u306b\u3001\u3082\u3046\u4e00\u5ea6\u51fa\u3057\u307e\u3059\u3002";
  persist();
  refreshStatuses();
  render();
}

function calculateDeferredTime(task) {
  const now = getCurrentNow();
  if (!task.scheduledAt) {
    return new Date(now.getTime() + 2 * 60 * 60 * 1000);
  }
  const scheduled = new Date(task.scheduledAt);
  const diffMinutes = (scheduled.getTime() - now.getTime()) / 60000;
  if (diffMinutes > 24 * 60) return new Date(scheduled.getTime() - 24 * 60 * 60 * 1000);
  if (diffMinutes > 120) return new Date(scheduled.getTime() - 90 * 60 * 1000);
  return new Date(now.getTime() + 30 * 60 * 1000);
}

function completeTask(taskId) {
  const task = findTask(taskId);
  if (!task) return;
  task.status = "completed";
  task.completedAt = getCurrentNow().toISOString();
  task.shownFromLater = false;
  state.ui.inputStatus = T.done;
  persist();
  render();
}

function isPastDueTask(task, nowMs) {
  if (!task || !task.scheduledAt || task.status === "completed") return false;
  return new Date(task.scheduledAt).getTime() < nowMs;
}

function snoozeTask(taskId, minutes, message) {
  const task = findTask(taskId);
  if (!task) return;
  task.status = "later";
  task.snoozeCount += 1;
  task.nextActionAt = new Date(getCurrentNow().getTime() + minutes * 60 * 1000).toISOString();
  task.shownFromLater = false;
  state.ui.inputStatus = message;
  persist();
  refreshStatuses();
  render();
}

function renderLaterToggle() {
  const count = state.tasks.filter((task) => task.status === "later" || task.status === "waiting").length;
  laterToggle.textContent = count > 0 ? `\u3042\u3068\u3067 ${count}\u4ef6` : "";
  laterToggle.classList.toggle("is-hidden", count === 0);
}

function renderLaterList() {
  laterList.innerHTML = "";
  laterPanel.classList.toggle("is-hidden", !state.ui.showLaterList);
  if (!state.ui.showLaterList) return;

  const tasks = state.tasks.filter((task) => task.status === "later" || task.status === "waiting");
  if (tasks.length === 0) {
    laterList.innerHTML = `<p class="record-meta">${T.laterEmpty}</p>`;
    return;
  }

  tasks
    .slice()
    .sort((a, b) => new Date(a.nextActionAt || a.createdAt) - new Date(b.nextActionAt || b.createdAt))
    .forEach((task) => {
      const fragment = laterItemTemplate.content.cloneNode(true);
      fragment.querySelector(".task-kicker").textContent = readableStatus(task);
      fragment.querySelector(".later-title").textContent = task.title;
      fragment.querySelector(".record-meta").textContent = buildLaterMeta(task);
      fragment.querySelector('[data-action="show-now"]').addEventListener("click", () => {
        task.status = "now";
        task.nextActionAt = getCurrentNow().toISOString();
        task.shownFromLater = false;
        state.ui.inputStatus = "\u4eca\u3059\u308b\u3053\u3068\u3078\u623b\u3057\u307e\u3057\u305f";
        persist();
        render();
      });
      laterList.appendChild(fragment);
    });
}

function renderViewMode() {
  mainView.classList.toggle("is-hidden", state.ui.showAllView);
  allView.classList.toggle("is-hidden", !state.ui.showAllView);
}

function renderAllList() {
  renderFilters();
  allList.innerHTML = "";
  const tasks = filteredTasks();
  if (tasks.length === 0) {
    allList.innerHTML = `<p class="record-meta">${T.allEmpty}</p>`;
    return;
  }

  tasks.forEach((task) => {
    const fragment = allItemTemplate.content.cloneNode(true);
    const metas = fragment.querySelectorAll(".record-meta");
    fragment.querySelector(".task-kicker").textContent = readableStatus(task);
    fragment.querySelector(".later-title").textContent = task.title || T.inbox;
    metas[0].textContent = `${T.allInputText}: ${task.rawText}`;
    metas[1].textContent = buildAllMeta(task);
    fragment.querySelector('[data-action="delete"]').addEventListener("click", () => confirmDelete(task.id));
    allList.appendChild(fragment);
  });
}

function renderFilters() {
  filterRow.querySelectorAll("[data-filter]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === state.ui.activeFilter);
  });
}

function filteredTasks() {
  if (state.ui.activeFilter === "all") return state.tasks.slice();
  if (state.ui.activeFilter === "now") return state.tasks.filter((task) => task.status === "now" || task.status === "inbox");
  if (state.ui.activeFilter === "later") return state.tasks.filter((task) => task.status === "later" || task.status === "waiting");
  return state.tasks.filter((task) => task.status === "completed");
}

function buildAllMeta(task) {
  const parts = [];
  parts.push(`${T.titleLabel}: ${task.title || T.inbox}`);
  if (task.date || task.time) parts.push(`${T.dateTimeLabel}: ${[formatDateJapanese(task.date), task.time].filter(Boolean).join("\u3000")}`);
  parts.push(`${T.statusLabel}: ${readableStatus(task)}`);
  if (task.nextActionAt) parts.push(`${T.nextLabel}: ${formatDateTime(task.nextActionAt)}`);
  parts.push(`${T.snoozeLabel}: ${task.snoozeCount}`);
  parts.push(`${T.completeLabel}: ${task.completedAt ? T.doneState : T.notDoneState}`);
  return parts.join(" / ");
}

function buildChoiceCopy(task) {
  if (task.date || task.time) return [formatDateJapanese(task.date), task.time].filter(Boolean).join("\u3000");
  return "\u3044\u3064\u307e\u3067\u306b\u3059\u308b\u304b\u306f\u3001\u3042\u3068\u3067\u6c7a\u3081\u3089\u308c\u307e\u3059\u3002";
}

function buildLaterMeta(task) {
  const parts = [];
  if (task.date || task.time) parts.push([formatDateJapanese(task.date), task.time].filter(Boolean).join("\u3000"));
  if (task.nextActionAt) parts.push(`${T.nextLabel}: ${formatDateTime(task.nextActionAt)}`);
  if (task.snoozeCount > 0) parts.push(`${T.snoozeLabel}: ${task.snoozeCount}`);
  return parts.join(" / ");
}

function readableStatus(task) {
  if (task.status === "inbox") return T.inbox;
  if (task.status === "later") return T.later;
  if (task.status === "waiting") return T.waiting;
  if (task.status === "now") return T.current;
  return T.completed;
}

function renderDebugJson() {
  debugJson.classList.toggle("is-hidden", !state.ui.showDebugJson);
  if (state.ui.showDebugJson) debugJson.textContent = JSON.stringify(state.tasks, null, 2);
}

function confirmDelete(taskId) {
  if (!window.confirm(T.deleteConfirm)) return;
  state.tasks = state.tasks.filter((task) => task.id !== taskId);
  if (state.pendingChoiceTaskId === taskId) state.pendingChoiceTaskId = null;
  state.ui.inputStatus = T.deleted;
  persist();
  render();
}

function buildScheduleLabel(task) {
  return [formatDateJapanese(task.date), normalizeTimeLabel(task)].filter(Boolean).join("\u3000");
}

function normalizeTimeLabel(task) {
  if (task.time) return task.time;
  if (!task.scheduledAt) return "";
  const date = new Date(task.scheduledAt);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDateJapanese(iso) {
  if (!iso) return "";
  const [, month, day] = iso.split("-");
  return `${Number(month)}\u6708${Number(day)}\u65e5`;
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatRelativeMinutes(minutes) {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return rest === 0 ? `${hours}\u6642\u9593` : `${hours}\u6642\u9593${rest}\u5206`;
  }
  return `${minutes}\u5206`;
}

function getCurrentNow() {
  const focusTask = state.tasks.find((task) => task.id === state.pendingChoiceTaskId) || state.tasks.find((task) => task.status !== "completed");
  if (!focusTask || !focusTask.scheduledAt || state.ui.testNowMode === "realtime") {
    return new Date(BASE_NOW);
  }
  const scheduled = new Date(focusTask.scheduledAt);
  if (state.ui.testNowMode === "minus30") return new Date(scheduled.getTime() - 30 * 60 * 1000);
  if (state.ui.testNowMode === "before5") return new Date(scheduled.getTime() - 5 * 60 * 1000);
  if (state.ui.testNowMode === "after10") return new Date(scheduled.getTime() + 10 * 60 * 1000);
  return new Date(BASE_NOW);
}

function findTask(taskId) {
  return state.tasks.find((task) => task.id === taskId);
}

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function sameDay(a, b) {
  const left = new Date(a);
  const right = new Date(b);
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate();
}

function isoDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function pad(value) {
  return String(value).padStart(2, "0");
}
