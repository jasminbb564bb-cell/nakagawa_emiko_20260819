(function attachNotificationSelector(global) {
  function getTimeWindow(now) {
    var hour = now.getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  }

  function getChronologicalValue(item) {
    return [item.prepStartAt, item.scheduledAt, item.deadlineAt, item.nextActionAt]
      .filter(Boolean)
      .map(function mapValue(value) { return new Date(value).getTime(); })
      .sort(function sortAscending(left, right) { return left - right; })[0] || Number.MAX_SAFE_INTEGER;
  }

  function buildStateWeight(item) {
    var weights = {
      PAST_UNCONFIRMED: 600,
      ACTION_NOW: 500,
      UPCOMING: 400,
      INBOX: 320,
      DATE_UNCONFIRMED: 250,
      NEED_INFO: 180,
      DONE: -999,
    };
    return weights[item.state] || 0;
  }

  function computeProfileBoost(item, now, profile) {
    if (!profile) return 0;
    var messageType = global.QuietNotificationHistory.buildMessageType(item);
    var boost = 0;

    if (profile.preferred_message_type === messageType) boost += 18;
    if (profile.preferred_time_window === getTimeWindow(now)) boost += 12;

    if (messageType === "remaining_time") boost += profile.remaining_time_score || 0;
    if (messageType === "action_instruction") boost += profile.action_instruction_score || 0;
    if (messageType === "preparation_start") boost += profile.preparation_start_score || 0;
    if (messageType === "deadline_warning") boost += profile.deadline_warning_score || 0;
    if (messageType === "progress_check") boost += profile.progress_check_score || 0;
    if (messageType === "overdue_check") boost += profile.overdue_check_score || 0;
    if (messageType === "memory_confirmation") boost += profile.memory_confirmation_score || 0;

    if (profile.ignore_rate > 0.45 && item.state === "INBOX") boost -= 25;
    if (profile.ignore_rate > 0.45 && item.state === "NEED_INFO") boost -= 15;

    return boost;
  }

  function computeItemScore(item, nowMs, profile) {
    var score = buildStateWeight(item);
    var anchor = getChronologicalValue(item);
    if (anchor !== Number.MAX_SAFE_INTEGER) {
      var diff = anchor - nowMs;
      if (diff <= 0) score += 120;
      else if (diff <= 60 * 60 * 1000) score += 90;
      else if (diff <= 24 * 60 * 60 * 1000) score += 45;
    }
    score -= ((item.prompt && item.prompt.dismissCount) || 0) * 8;
    score += item.reactionScore || 0;
    score += computeProfileBoost(item, new Date(nowMs), profile);
    return score;
  }

  function compareByPriority(left, right, nowMs, profile) {
    var diff = computeItemScore(right, nowMs, profile) - computeItemScore(left, nowMs, profile);
    if (diff !== 0) return diff;
    return getChronologicalValue(left) - getChronologicalValue(right);
  }

  function pickFocusItem(items, nowMs, profile) {
    return items
      .filter(function filterItem(item) { return item.state !== "DONE"; })
      .sort(function sortItems(left, right) {
        return compareByPriority(left, right, nowMs, profile);
      })[0] || null;
  }

  global.QuietNotificationSelector = {
    computeItemScore: computeItemScore,
    compareByPriority: compareByPriority,
    pickFocusItem: pickFocusItem,
  };
})(window);
