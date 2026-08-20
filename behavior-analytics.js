(function attachBehaviorAnalytics(global) {
  function emptyProfile() {
    return {
      preferred_reminder_offset: null,
      morning_response_score: 0,
      afternoon_response_score: 0,
      evening_response_score: 0,
      remaining_time_score: 0,
      action_instruction_score: 0,
      preparation_start_score: 0,
      deadline_warning_score: 0,
      progress_check_score: 0,
      overdue_check_score: 0,
      memory_confirmation_score: 0,
      average_response_minutes: null,
      snooze_rate: 0,
      ignore_rate: 0,
      completion_after_notification_rate: 0,
      preferred_message_type: null,
      preferred_time_window: null,
      updated_at: null,
    };
  }

  function scoreResult(entry) {
    if (entry.result === "done") return 2;
    if (entry.result === "reschedule" || entry.result === "change_time") return 1;
    if (entry.result === "ignored") return -1;
    return 0;
  }

  function average(values) {
    if (!values.length) return null;
    return Math.round(values.reduce(function sum(total, value) { return total + value; }, 0) / values.length);
  }

  function summarize(history) {
    var profile = emptyProfile();
    var messageScores = {};
    var windowScores = { morning: 0, afternoon: 0, evening: 0 };
    var responseMinutes = [];
    var positiveOffsets = [];
    var ignoredCount = 0;
    var snoozedCount = 0;
    var completedCount = 0;

    history.forEach(function eachEntry(entry) {
      var resultScore = scoreResult(entry);
      messageScores[entry.message_type] = (messageScores[entry.message_type] || 0) + resultScore;
      windowScores[entry.time_of_day] = (windowScores[entry.time_of_day] || 0) + resultScore;
      if (entry.result === "ignored") ignoredCount += 1;
      if (entry.snoozed) snoozedCount += 1;
      if (entry.completed_after_notification) completedCount += 1;
      if (typeof entry.minutes_before_due === "number" && entry.result === "done") positiveOffsets.push(entry.minutes_before_due);
      if (entry.opened_at && entry.completed_at) {
        responseMinutes.push(Math.round((new Date(entry.completed_at).getTime() - new Date(entry.opened_at).getTime()) / 60000));
      }
    });

    profile.morning_response_score = windowScores.morning || 0;
    profile.afternoon_response_score = windowScores.afternoon || 0;
    profile.evening_response_score = windowScores.evening || 0;
    profile.remaining_time_score = messageScores.remaining_time || 0;
    profile.action_instruction_score = messageScores.action_instruction || 0;
    profile.preparation_start_score = messageScores.preparation_start || 0;
    profile.deadline_warning_score = messageScores.deadline_warning || 0;
    profile.progress_check_score = messageScores.progress_check || 0;
    profile.overdue_check_score = messageScores.overdue_check || 0;
    profile.memory_confirmation_score = messageScores.memory_confirmation || 0;
    profile.average_response_minutes = average(responseMinutes);
    profile.preferred_reminder_offset = average(positiveOffsets);
    profile.snooze_rate = history.length ? snoozedCount / history.length : 0;
    profile.ignore_rate = history.length ? ignoredCount / history.length : 0;
    profile.completion_after_notification_rate = history.length ? completedCount / history.length : 0;

    var topMessage = Object.entries(messageScores).sort(function sortScores(left, right) {
      return right[1] - left[1];
    })[0];
    if (topMessage && topMessage[1] > 0) profile.preferred_message_type = topMessage[0];

    var topWindow = Object.entries(windowScores).sort(function sortScores(left, right) {
      return right[1] - left[1];
    })[0];
    if (topWindow && topWindow[1] > 0) profile.preferred_time_window = topWindow[0];

    profile.updated_at = new Date().toISOString();
    return profile;
  }

  global.QuietBehaviorAnalytics = {
    emptyProfile: emptyProfile,
    summarize: summarize,
  };
})(window);
