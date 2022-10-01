import { createContext, FC, useCallback, useContext } from "react";
import type { Models } from "appwrite";
import { useEffectOnce, useLocalStorage } from "usehooks-ts";
import shortId from "shortid";

import { appwrite } from "../utils";

type ICurrentSession = Models.Preferences | undefined;

interface IAuthContext {
  createAccount: (
    args: ICreateAccountArgs
  ) => Promise<Models.Account<Models.Preferences>>;
  login: (email: string, passsword: string) => Promise<void>;
  logout: () => Promise<void>;
  currentSession: ICurrentSession;
}

interface ICreateAccountArgs {
  email: string;
  password: string;
  username: string;
}

interface Props {
  children?: React.ReactNode;
}

const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider: FC<Props> = ({ children }) => {
  const [currentSession, setCurrentSession] = useLocalStorage<ICurrentSession>(
    "ctx.session",
    undefined
  );

  const createAccount = useCallback(async (args: ICreateAccountArgs) => {
    const { email, password, username } = args;
    return await appwrite.account.create(shortId(), email, password, username);
  }, []);

  const getCurrentSession = useCallback(async () => {
    try {
      const user = await appwrite.account.get();
      setCurrentSession(user);
    } catch {
      setCurrentSession(undefined);
    }
  }, [setCurrentSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      await appwrite.account.createEmailSession(email, password);
      await getCurrentSession();
    },
    [getCurrentSession]
  );

  const logout = useCallback(async () => {
    await appwrite.account.deleteSession("current");
    setCurrentSession(undefined);
  }, []);

  useEffectOnce(() => {
    getCurrentSession().catch(console.error);
  });

  return (
    <AuthContext.Provider
      value={{ createAccount, login, logout, currentSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
