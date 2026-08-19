const STORAGE_KEY = "quiet-todo-flow-v2";

const state = loadState();

const topDate = document.querySelector("#top-date");
const heroIntro = document.querySelector("#hero-intro");
const focusCard = document.querySelector("#focus-card");
const laterToggle = document.querySelector("#later-toggle");
const inputGuide = document.querySelector("#input-guide");
const input = document.querySelector("#quick-input");
const createTaskButton = document.querySelector("#create-task");
const inputStatus = document.querySelector("#input-status");
const choicePanel = document.querySelector("#choice-panel");
const choiceCard = document.querySelector("#choice-card");
const laterPanel = document.querySelector("#later-panel");
const laterList = document.querySelector("#later-list");

const focusTemplate = document.querySelector("#focus-template");
const choiceTemplate = document.querySelector("#choice-template");
const laterItemTemplate = document.querySelector("#later-item-template");

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
    return JSON.parse(saved);
  }

  return {
    tasks: [],
    pendingChoiceTaskId: null,
    ui: {
      inputStatus: "思いついたまま入れて大丈夫です。",
      showLaterList: false,
      hintsSeen: {
        choiceMeaning: false,
        laterSaved: false,
        laterReturned: false,
        completion: false,
        input: false,
      },
    },
  };
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function seedIfEmpty() {
  if (state.tasks.length > 0) {
    return;
  }

  const now = new Date();
  const future = new Date(now.getTime() + 90 * 60000);
  const month = future.getMonth() + 1;
  const day = future.getDate();
  const hour = future.getHours();
  const minute = String(future.getMinutes()).padStart(2, "0");
  const sample = `美容院 ${month}月${day}日 ${hour}:${minute}`;
  const task = buildTask(sample);
  task.status = "later";
  task.nextActionAt = new Date(now.getTime() + 60 * 1000).toISOString();
  state.tasks.push(task);
  persist();
}

function bindEvents() {
  createTaskButton.addEventListener("click", handleCreateTask);
  laterToggle.addEventListener("click", () => {
    state.ui.showLaterList = !state.ui.showLaterList;
    persist();
    renderLaterList();
  });
}

function handleCreateTask() {
  const rawText = input.value.trim();

  if (!rawText) {
    state.ui.inputStatus = "空でも大丈夫です。思いついた時に戻ってきてください。";
    renderInputStatus();
    persist();
    return;
  }

  const task = buildTask(rawText);
  state.tasks.unshift(task);
  state.pendingChoiceTaskId = task.id;
  state.ui.inputStatus = "いったん預かりました。今か、あとでかだけ決めれば足ります。";
  state.ui.hintsSeen.input = true;
  input.value = "";
  persist();
  refreshStatuses();
  render();
}

function buildTask(rawText) {
  const parsed = parseDateTime(rawText);
  const now = new Date();
  const title = buildTitle(rawText);

  return {
    id: crypto.randomUUID(),
    rawText,
    title,
    date: parsed.dateText,
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
  const now = new Date();
  const normalized = normalizeNumbers(text);

  const dateMatch = normalized.match(/(?:(\d{1,2})月(\d{1,2})日)|(?:(\d{1,2})\/(\d{1,2}))/);
  const timeMatch =
    normalized.match(/(午前|午後)?\s*(\d{1,2})[:時]\s*(\d{1,2})?/) ||
    normalized.match(/(午前|午後)?\s*(\d{1,2})時/);

  let month = null;
  let day = null;

  if (dateMatch) {
    month = Number(dateMatch[1] || dateMatch[3]);
    day = Number(dateMatch[2] || dateMatch[4]);
  }

  let hours = null;
  let minutes = 0;
  if (timeMatch) {
    const meridiem = timeMatch[1] || "";
    hours = Number(timeMatch[2]);
    minutes = Number(timeMatch[3] || 0);
    if (meridiem === "午後" && hours < 12) {
      hours += 12;
    }
    if (meridiem === "午前" && hours === 12) {
      hours = 0;
    }
  }

  let scheduledAt = null;
  if (month && day) {
    let year = now.getFullYear();
    const candidate = new Date(year, month - 1, day, hours ?? 9, minutes, 0, 0);
    if (candidate.getTime() < now.getTime()) {
      year += 1;
    }
    scheduledAt = new Date(year, month - 1, day, hours ?? 9, minutes, 0, 0).toISOString();
  }

  return {
    dateText: month && day ? `${month}月${day}日` : null,
    timeText: hours !== null ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}` : null,
    scheduledAt,
  };
}

function normalizeNumbers(text) {
  return text
    .replaceAll("一", "1")
    .replaceAll("二", "2")
    .replaceAll("三", "3")
    .replaceAll("四", "4")
    .replaceAll("五", "5")
    .replaceAll("六", "6")
    .replaceAll("七", "7")
    .replaceAll("八", "8")
    .replaceAll("九", "9")
    .replaceAll("〇", "0");
}

function buildTitle(rawText) {
  return rawText
    .replace(/(\d{1,2})月(\d{1,2})日/g, "")
    .replace(/(\d{1,2})\/(\d{1,2})/g, "")
    .replace(/(午前|午後)?\s*\d{1,2}[:時]\s*\d{0,2}/g, "")
    .replace(/(午前|午後)?\s*\d{1,2}時/g, "")
    .replace(/\s+/g, " ")
    .trim() || rawText;
}

function refreshStatuses() {
  const now = Date.now();

  state.tasks.forEach((task) => {
    if (task.status === "completed" || task.status === "inbox") {
      return;
    }

    if (task.status === "later" && task.nextActionAt && new Date(task.nextActionAt).getTime() <= now) {
      task.status = "now";
      task.shownFromLater = true;
      return;
    }

    if (!task.scheduledAt) {
      return;
    }

    const scheduledAt = new Date(task.scheduledAt).getTime();
    const hoursUntil = (scheduledAt - now) / 3600000;

    if (scheduledAt <= now) {
      task.status = "now";
      return;
    }

    if (hoursUntil <= 24 && task.status !== "inbox") {
      task.status = "now";
      return;
    }

    if (task.status !== "later" && task.status !== "now") {
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
}

function renderDate() {
  const formatter = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
  topDate.textContent = formatter.format(new Date());
}

function renderIntro() {
  heroIntro.innerHTML = `
    <p class="hero-intro-main">思いついた言葉を、<br />スペースで区切って入れるだけ。</p>
    <p class="hero-intro-sub">あとは、こちらで整理して、<br />必要なときにお知らせします。</p>
    <p class="hero-intro-sub">使うほど、<br /><span class="hero-intro-emphasis">あなたの予定をわかってくれる</span><br /><span class="hero-intro-emphasis">小さな秘書になります。</span></p>
  `;
}

function renderInputGuide() {
  if (state.ui.hintsSeen.input) {
    inputGuide.textContent = "";
    inputGuide.classList.add("is-hidden");
    return;
  }

  inputGuide.innerHTML = "思いついたことを、そのまま書いてください。<br />整理はあとで大丈夫です。";
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
    guide.innerHTML =
      "「今」 今すぐ考えたり動いたりするもの<br />「あとで」 今は忘れて大丈夫です。必要な時にアプリがもう一度出します。";
    guide.classList.remove("is-hidden");
  }

  fragment.querySelectorAll("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      handleChoice(task.id, button.dataset.choice);
    });
  });

  choiceCard.appendChild(fragment);
}

function handleChoice(taskId, choice) {
  const task = state.tasks.find((item) => item.id === taskId);
  if (!task) {
    return;
  }

  const now = new Date();

  if (choice === "now") {
    task.status = "now";
    task.nextActionAt = now.toISOString();
    state.ui.inputStatus = "今見るものとして前に出しました。";
  } else if (choice === "later") {
    task.status = task.scheduledAt ? "waiting" : "later";
    task.nextActionAt = calculateNextActionAt(task, "later");
    task.shownFromLater = false;
    state.ui.inputStatus = "あとでにしました。必要な時に、こちらからもう一度出します。";
    state.ui.hintsSeen.laterSaved = true;
  } else if (choice === "soon") {
    task.status = "later";
    task.nextActionAt = new Date(now.getTime() + 60 * 1000).toISOString();
    task.shownFromLater = false;
    state.ui.inputStatus = "1分後にもう一度出すようにしました。";
  }

  state.ui.hintsSeen.choiceMeaning = true;
  state.pendingChoiceTaskId = null;
  persist();
  refreshStatuses();
  render();
}

function calculateNextActionAt(task, mode) {
  const now = new Date();

  if (!task.scheduledAt) {
    return new Date(now.getTime() + 4 * 3600000).toISOString();
  }

  const scheduledAt = new Date(task.scheduledAt);
  const dayBefore = new Date(scheduledAt.getTime() - 24 * 3600000);
  const soon = new Date(scheduledAt.getTime() - 90 * 60000);

  if (mode === "later") {
    if (dayBefore.getTime() > now.getTime()) {
      return dayBefore.toISOString();
    }
    if (soon.getTime() > now.getTime()) {
      return soon.toISOString();
    }
  }

  return new Date(now.getTime() + 60 * 60000).toISOString();
}

function getFocusTask() {
  const candidates = state.tasks.filter((task) => task.status !== "completed" && task.id !== state.pendingChoiceTaskId);
  if (candidates.length === 0) {
    return null;
  }

  const scored = candidates.map((task) => ({
    task,
    score: scoreTask(task),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored[0].task;
}

function scoreTask(task) {
  const now = Date.now();
  let score = 0;

  if (task.scheduledAt) {
    const scheduled = new Date(task.scheduledAt).getTime();
    if (scheduled <= now) {
      score += 5000;
    }
    if (sameDay(scheduled, now)) {
      score += 2500;
    }
    const minutesUntil = (scheduled - now) / 60000;
    if (minutesUntil > 0 && minutesUntil <= 120) {
      score += 3200 - minutesUntil;
    }
  }

  if (task.status === "now") {
    score += 4000;
  }

  if (task.nextActionAt && new Date(task.nextActionAt).getTime() <= now) {
    score += 3000;
  }

  if (task.status === "later") {
    score += 1200;
  }

  if (task.status === "waiting") {
    score += 700;
  }

  score += task.snoozeCount * 80;
  return score;
}

function renderFocusCard() {
  focusCard.innerHTML = "";
  const task = getFocusTask();

  if (!task) {
    focusCard.innerHTML = `
      <article class="task-card">
        <p class="task-kicker">今はこれだけ</p>
        <h1 class="task-title">まだ何もしなくて大丈夫です。</h1>
        <p class="task-copy">思いついたことを入れておけば、必要な時にこちらから戻します。</p>
      </article>
    `;
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
    button.className = "text-button";
    button.type = "button";
    button.textContent = action.label;
    button.addEventListener("click", action.onClick);
    actions.appendChild(button);
  });

  task.lastShownAt = new Date().toISOString();
  focusCard.appendChild(fragment);
  persist();
}

function describeTaskView(task) {
  const now = Date.now();

  if (!task.scheduledAt) {
    return {
      mode: "undated",
      kicker: "今、すること",
      time: "いま",
      title: task.title,
      copy: "まだ日時が決まっていません。今考えるなら進めて、まだならあとでも大丈夫です。",
    };
  }

  const scheduled = new Date(task.scheduledAt).getTime();
  const diffMinutes = Math.round((scheduled - now) / 60000);
  const diffHours = diffMinutes / 60;

  if (diffMinutes < 0) {
    return {
      mode: "after-event",
      kicker: `${task.title}は終わりましたか？`,
      time: formatDateTime(task.scheduledAt),
      title: task.title,
      copy: "終わったら「完了」にしてください。まだ終わっていなければ、そのまま残せます。",
    };
  }

  if (diffMinutes <= 120) {
    return {
      mode: "soon",
      kicker: `${task.title}まであと${formatRelativeMinutes(diffMinutes)}`,
      time: formatDateTime(task.scheduledAt),
      title: task.title,
      copy: "そろそろ準備する時間です。",
    };
  }

  if (diffHours <= 24) {
    return {
      mode: "tomorrow",
      kicker: sameDay(scheduled, now) ? "今日は予定があります" : `${task.title}は明日です`,
      time: formatDateTime(task.scheduledAt),
      title: task.title,
      copy: sameDay(scheduled, now)
        ? "今日の予定として前に出しました。"
        : "場所や準備を確認しますか？",
    };
  }

  return {
    mode: "future",
    kicker: "今、すること",
    time: formatDateTime(task.scheduledAt),
    title: task.title,
    copy: "まだ先なので、今は何もしなくて大丈夫です。",
  };
}

function buildContextGuide(task, mode) {
  if (task.shownFromLater && !state.ui.hintsSeen.laterReturned) {
    state.ui.hintsSeen.laterReturned = true;
    persist();
    return "前に「あとで」にしたものです。そろそろ確認する時間なので戻しました。";
  }

  if (mode === "after-event" && !state.ui.hintsSeen.completion) {
    state.ui.hintsSeen.completion = true;
    persist();
    return "終わったら「完了」にしてください。まだ終わっていなければ、そのまま残せます。";
  }

  return "";
}

function buildFocusActions(task, mode) {
  if (mode === "after-event") {
    return [
      {
        label: "完了",
        onClick: () => completeTask(task.id),
      },
      {
        label: "まだ",
        onClick: () => snoozeTask(task.id, 30, "まだ終わっていないので、少し後でもう一度出します。"),
      },
    ];
  }

  return [
    {
      label: "やる",
      onClick: () => markNow(task.id),
    },
    {
      label: "あとで",
      onClick: () => deferTask(task.id),
    },
  ];
}

function markNow(taskId) {
  const task = findTask(taskId);
  if (!task) {
    return;
  }

  task.status = "now";
  task.nextActionAt = new Date().toISOString();
  task.shownFromLater = false;
  state.ui.inputStatus = "今見るものとして残しています。";
  persist();
  render();
}

function deferTask(taskId) {
  const task = findTask(taskId);
  if (!task) {
    return;
  }

  task.snoozeCount += 1;
  task.status = "later";
  task.nextActionAt = calculateDeferredTime(task);
  task.shownFromLater = false;

  if (task.snoozeCount >= 3) {
    state.ui.inputStatus = `これ、まだ残っています。${task.title}のことを決めますか？`;
  } else {
    state.ui.inputStatus = "今は忘れて大丈夫です。必要な時にまた戻します。";
  }

  persist();
  refreshStatuses();
  render();
}

function calculateDeferredTime(task) {
  const now = new Date();

  if (!task.scheduledAt) {
    const hours = task.snoozeCount >= 2 ? 2 : 6;
    return new Date(now.getTime() + hours * 3600000).toISOString();
  }

  const scheduled = new Date(task.scheduledAt);
  const hoursLeft = (scheduled.getTime() - now.getTime()) / 3600000;

  if (hoursLeft > 24) {
    return new Date(scheduled.getTime() - 24 * 3600000).toISOString();
  }

  if (hoursLeft > 2) {
    return new Date(scheduled.getTime() - 90 * 60000).toISOString();
  }

  return new Date(now.getTime() + 30 * 60000).toISOString();
}

function completeTask(taskId) {
  const task = findTask(taskId);
  if (!task) {
    return;
  }

  task.status = "completed";
  task.completedAt = new Date().toISOString();
  task.shownFromLater = false;
  state.ui.inputStatus = "完了として記録しました。";
  persist();
  render();
}

function snoozeTask(taskId, minutes, message) {
  const task = findTask(taskId);
  if (!task) {
    return;
  }

  task.status = "later";
  task.nextActionAt = new Date(Date.now() + minutes * 60000).toISOString();
  task.snoozeCount += 1;
  task.shownFromLater = false;
  state.ui.inputStatus = message;
  persist();
  refreshStatuses();
  render();
}

function renderLaterToggle() {
  const count = state.tasks.filter((task) => task.status === "later" || task.status === "waiting").length;
  laterToggle.textContent = count > 0 ? `あとで ${count}件` : "";
  laterToggle.classList.toggle("is-hidden", count === 0);
}

function renderLaterList() {
  laterList.innerHTML = "";
  laterPanel.classList.toggle("is-hidden", !state.ui.showLaterList);

  if (!state.ui.showLaterList) {
    return;
  }

  const tasks = state.tasks.filter((task) => task.status === "later" || task.status === "waiting");
  if (tasks.length === 0) {
    laterList.innerHTML = '<p class="record-meta">今は空です。</p>';
    return;
  }

  tasks
    .sort((a, b) => new Date(a.nextActionAt || a.createdAt).getTime() - new Date(b.nextActionAt || b.createdAt).getTime())
    .forEach((task) => {
      const fragment = laterItemTemplate.content.cloneNode(true);
      fragment.querySelector(".task-kicker").textContent = task.status === "waiting" ? "待機中" : "あとで";
      fragment.querySelector(".later-title").textContent = task.title;
      fragment.querySelector(".record-meta").textContent = buildLaterMeta(task);
      fragment.querySelector('[data-action="show-now"]').addEventListener("click", () => {
        task.status = "now";
        task.nextActionAt = new Date().toISOString();
        state.ui.inputStatus = "今見るものとして戻しました。";
        persist();
        render();
      });
      laterList.appendChild(fragment);
    });
}

function buildChoiceCopy(task) {
  if (task.date || task.time) {
    return `${task.date || "日付未定"} ${task.time || ""}`.trim();
  }
  return "日時がまだ曖昧でも大丈夫です。";
}

function buildLaterMeta(task) {
  const parts = [];
  if (task.date || task.time) {
    parts.push(`${task.date || ""} ${task.time || ""}`.trim());
  }
  if (task.nextActionAt) {
    parts.push(`次に出す予定 ${formatDateTime(task.nextActionAt)}`);
  }
  if (task.snoozeCount > 0) {
    parts.push(`あとで ${task.snoozeCount}回`);
  }
  return parts.join(" / ");
}

function findTask(taskId) {
  return state.tasks.find((task) => task.id === taskId);
}

function sameDay(a, b) {
  const left = new Date(a);
  const right = new Date(b);
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function formatRelativeMinutes(minutes) {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    if (rest === 0) {
      return `${hours}時間`;
    }
    return `${hours}時間${rest}分`;
  }
  return `${minutes}分`;
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
