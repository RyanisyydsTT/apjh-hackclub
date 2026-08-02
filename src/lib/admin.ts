import type { Session } from "next-auth";

type AdminSession = Session & {
  user: Session["user"] & {
    isAdmin: true;
  };
};

export function isAdminSession(session: Session | null): session is AdminSession {
  return session?.user?.isAdmin === true;
}
