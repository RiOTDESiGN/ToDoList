import { logEvent } from "firebase/analytics";
import { analytics } from "./firebase";

export function trackLoginEvent(user) {
  logEvent(analytics, "login", {
    userId: user.uid,
    method: "EmailAndPassword",
  });
}
