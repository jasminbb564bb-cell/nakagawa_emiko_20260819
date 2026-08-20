(function attachNotificationHistory(global) {
  function ensureState(state) {
    if (!state.notificationHistory) state.notificationHistory = [];
    if (!state.learningMeta) state.learningMeta = {};
    if (!state.learningMeta.lastPresentationSignature) state.learningMeta.lastPresentationSignature = null;
  }

  function buildMessageType(item) {
    if (!item) return "memory_confirmation";
    if (item.state === "PAST_UNCONFIRMED") return "overdue_check";
    if (item.state === "ACTION_NOW" && item.kind === "schedule") return "departure_now";
    if (item.state === "ACTION_NOW") return "action_instruction";
    if (item.state === "UPCOMING" && item.prepStartAt) return "preparation_start";
    if (item.state === "UPCOMING") return "remaining_time";
    if (item.state === "DATE_UNCONFIRMED") return "change_confirmation";
    if (item.state === "INBOX") return "memory_confirmation";
    return "progress_check";
  }

  function buildTimeOfDay(date) {
    var hour = date.getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  }

  function buildDueAnchor(item) {
    return item.prepStartAt || item.scheduledAt || item.deadlineAt || item.nextActionAt || null;
  }

  function buildMinutesBeforeDue(item, shownAt) {
    var anchor = buildDueAnchor(item);
    if (!anchor) return null;
    return Math.round((new Date(anchor).getTime() - shownAt.getTime()) / 60000);
  }

  function buildPresentationSignature(item, messageType) {
    return [item.id, item.state, messageType].join(":");
  }

  function recordPresentation(state, item, context) {
    ensureState(state);
    if (!item) return null;

    var shownAt = context && context.shownAt ? new Date(context.shownAt) : new Date();
    var messageType = (context && context.messageType) || buildMessageType(item);
    var signature = buildPresentationSignature(item, messageType);

    if (state.learningMeta.lastPresentationSignature === signature) {
      var recent = state.notificationHistory[state.notificationHistory.length - 1];
      if (recent && recent.signature === signature) return recent.id;
    }

    var entry = {
      id: "nh_" + shownAt.getTime() + "_" + Math.random().toString(36).slice(2, 8),
      task_id: item.id,
      shown_at: shownAt.toISOString(),
      channel: (context && context.channel) || "home",
      message_type: messageType,
      message_text: (context && context.messageText) || item.title,
      minutes_before_due: buildMinutesBeforeDue(item, shownAt),
      task_type: item.kind,
      day_of_week: shownAt.getDay(),
      time_of_day: buildTimeOfDay(shownAt),
      opened: true,
      opened_at: shownAt.toISOString(),
      dismissed: false,
      ignored: false,
      snoozed: false,
      snooze_minutes: null,
      app_opened_after_minutes: 0,
      completed_before_notification: Boolean(item.completedAt),
      completed_after_notification: false,
      completed_at: null,
      result: "shown",
      created_at: shownAt.toISOString(),
      signature: signature,
    };

    state.notificationHistory.push(entry);
    state.learningMeta.lastPresentationSignature = signature;
    return entry.id;
  }

  function updatePresentation(state, taskId, patch) {
    ensureState(state);
    for (var index = state.notificationHistory.length - 1; index >= 0; index -= 1) {
      var entry = state.notificationHistory[index];
      if (entry.task_id !== taskId) continue;
      if (!entry.opened) continue;
      Object.assign(entry, patch);
      return entry;
    }
    return null;
  }

  function markAction(state, taskId, action, nowIso) {
    var now = nowIso || new Date().toISOString();
    if (action === "done") {
      return updatePresentation(state, taskId, {
        completed_after_notification: true,
        completed_at: now,
        result: "done",
      });
    }
    if (action === "reschedule") {
      return updatePresentation(state, taskId, {
        dismissed: true,
        result: "reschedule",
      });
    }
    if (action === "change_time") {
      return updatePresentation(state, taskId, {
        dismissed: true,
        result: "change_time",
      });
    }
    if (action === "dismiss") {
      return updatePresentation(state, taskId, {
        dismissed: true,
        ignored: true,
        result: "ignored",
      });
    }
    return null;
  }

  function getRecentHistoryForTask(state, taskId) {
    ensureState(state);
    return state.notificationHistory.filter(function filterEntry(entry) {
      return entry.task_id === taskId;
    });
  }

  global.QuietNotificationHistory = {
    ensureState: ensureState,
    buildMessageType: buildMessageType,
    recordPresentation: recordPresentation,
    markAction: markAction,
    getRecentHistoryForTask: getRecentHistoryForTask,
  };
})(window);
