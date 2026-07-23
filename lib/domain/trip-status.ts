export function isAllowedDriverTransition(current: string, next: string) {
  return (current === "pending" || current === "confirmed") ? next === "accepted"
    : current === "accepted" ? next === "en_route"
      : current === "en_route" ? next === "started"
        : current === "started" ? next === "completed"
          : false;
}
