module.exports = {
  extends: ["react-app", "react-app/jest"],
  rules: {
    // Enforce the basic Rules of Hooks
    "react-hooks/rules-of-hooks": "error",
    // Warn on missing dependencies in effects (can be locally disabled when intentional)
    "react-hooks/exhaustive-deps": "warn"
  }
};
