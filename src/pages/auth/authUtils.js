// ─── Storage keys ────────────────────────────────────────────────────────────
export const USERS_DB_KEY  = "lifesync_users_db";
export const SESSION_KEY   = "lifesync_user";

// ─── Demo user (always available) ────────────────────────────────────────────
export const DEMO_USER = {
  id:        "demo-user-001",
  name:      "Alex Demo",
  email:     "demo@lifesync.app",
  password:  "demo1234",
  createdAt: "2026-01-01T00:00:00.000Z",
};

// ─── ID helper ───────────────────────────────────────────────────────────────
export function createId() {
  return (
    globalThis.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

// ─── Read / write users DB ───────────────────────────────────────────────────
export function readUsersDb() {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    // Always ensure demo user is present (not stored, resolved at read-time)
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeUsersDb(users) {
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } catch (err) {
    console.error("Could not write users DB:", err);
  }
}

// ─── Session helpers ─────────────────────────────────────────────────────────
export function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeSession(user) {
  try {
    const session = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error("Could not write session:", err);
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ─── Auth logic ───────────────────────────────────────────────────────────────
/**
 * Register a new user.
 * Returns { ok: true, user } or { ok: false, field, message }
 */
export function registerUser({ name, email, password, confirmPassword }) {
  const trimName  = name.trim();
  const trimEmail = email.trim().toLowerCase();

  if (!trimName)        return { ok: false, field: "name",            message: "Full name is required." };
  if (!trimEmail)       return { ok: false, field: "email",           message: "Email address is required." };
  if (!isValidEmail(trimEmail)) return { ok: false, field: "email",   message: "Enter a valid email address." };
  if (!password)        return { ok: false, field: "password",        message: "Password is required." };
  if (password.length < 6) return { ok: false, field: "password",    message: "Password must be at least 6 characters." };
  if (password !== confirmPassword) return { ok: false, field: "confirmPassword", message: "Passwords do not match." };

  // Check demo email collision
  if (trimEmail === DEMO_USER.email) {
    return { ok: false, field: "email", message: "This email is already registered." };
  }

  const users = readUsersDb();
  if (users.some((u) => u.email.toLowerCase() === trimEmail)) {
    return { ok: false, field: "email", message: "An account with this email already exists." };
  }

  const newUser = {
    id:        createId(),
    name:      trimName,
    email:     trimEmail,
    password,
    createdAt: new Date().toISOString(),
  };

  writeUsersDb([...users, newUser]);
  return { ok: true, user: newUser };
}

/**
 * Sign in a user.
 * Returns { ok: true, user } or { ok: false, field, message }
 */
export function loginUser({ email, password }) {
  const trimEmail = email.trim().toLowerCase();

  if (!trimEmail)  return { ok: false, field: "email",    message: "Email address is required." };
  if (!password)   return { ok: false, field: "password", message: "Password is required." };

  // Check demo user first (not stored in DB)
  if (trimEmail === DEMO_USER.email && password === DEMO_USER.password) {
    return { ok: true, user: DEMO_USER };
  }

  const users = readUsersDb();
  const found = users.find((u) => u.email.toLowerCase() === trimEmail);

  if (!found) {
    return { ok: false, field: "email", message: "No account found with this email." };
  }
  if (found.password !== password) {
    return { ok: false, field: "password", message: "Incorrect password. Please try again." };
  }

  return { ok: true, user: found };
}

// ─── Utility ──────────────────────────────────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
