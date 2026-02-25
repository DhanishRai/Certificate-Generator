const VERIFICATIONS_KEY = "total_verifications";

export const getVerificationCount = () => {
  const value = Number(localStorage.getItem(VERIFICATIONS_KEY) || "0");
  return Number.isNaN(value) ? 0 : value;
};

export const incrementVerificationCount = () => {
  const next = getVerificationCount() + 1;
  localStorage.setItem(VERIFICATIONS_KEY, String(next));
  return next;
};
