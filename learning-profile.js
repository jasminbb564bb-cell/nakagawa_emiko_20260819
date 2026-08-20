(function attachLearningProfile(global) {
  function ensureState(state) {
    if (!state.userLearning) state.userLearning = { termKinds: {}, history: [] };
    if (!state.userBehaviorProfile) {
      state.userBehaviorProfile = global.QuietBehaviorAnalytics.emptyProfile();
    }
  }

  function refresh(state) {
    ensureState(state);
    state.userBehaviorProfile = global.QuietBehaviorAnalytics.summarize(state.notificationHistory || []);
    return state.userBehaviorProfile;
  }

  function recordClassificationCorrection(state, item, selectedKind) {
    ensureState(state);
    item.tokens.filter(function filterToken(token) {
      return token && token.length >= 2;
    }).forEach(function eachToken(term) {
      var current = state.userLearning.termKinds[term] || { schedule: 0, todo: 0, memo: 0 };
      current[selectedKind] = (current[selectedKind] || 0) + 1;
      state.userLearning.termKinds[term] = current;
    });
    state.userLearning.history.push({
      itemId: item.id,
      rawText: item.rawText,
      selectedKind: selectedKind,
      recordedAt: new Date().toISOString(),
    });
  }

  global.QuietLearningProfile = {
    ensureState: ensureState,
    refresh: refresh,
    recordClassificationCorrection: recordClassificationCorrection,
  };
})(window);
