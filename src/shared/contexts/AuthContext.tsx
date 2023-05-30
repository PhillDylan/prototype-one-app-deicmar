import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';

import { AuthService } from '../services/api/auth/AuthService';

interface IAuthContextData {
  logout: () => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string | void>;
}

const AuthContext = createContext({} as IAuthContextData);

const COOKIE_KEY__ACCESS_TOKEN = 'APP_ACCESS_TOKEN';
const COOKIE_KEY__ID_OPERADOR = 'APP_ID_OPERADOR';
const COOKIE_KEY__MESSAGE = 'APP_MESSAGE';
const COOKIE_KEY__NOME_OPERADOR = 'APP_NOME_OPERADOR';

interface IAuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string>();
  const [idOperador, setIdOperador] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [nomeOperador, setNomeOperador] = useState<string>();

  useEffect(() => {
    const accessToken = Cookies.get(COOKIE_KEY__ACCESS_TOKEN);
    const idOperador = Cookies.get(COOKIE_KEY__ID_OPERADOR);
    const message = Cookies.get(COOKIE_KEY__MESSAGE);
    const nomeOperador = Cookies.get(COOKIE_KEY__NOME_OPERADOR);

    if (accessToken) {
      setAccessToken(accessToken);
    }
    if (idOperador) {
      setIdOperador(idOperador);
    }
    if (message) {
      setMessage(message);
    }
    if (nomeOperador) {
      setNomeOperador(nomeOperador);
    }
  }, []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    const result = await AuthService.auth(email, password);
    if (result instanceof Error) {
      return result.message;
    } else {
      Cookies.set(COOKIE_KEY__ACCESS_TOKEN, result.accessToken);
      Cookies.set(COOKIE_KEY__ID_OPERADOR, result.idoperador);
      Cookies.set(COOKIE_KEY__MESSAGE, result.message);
      Cookies.set(COOKIE_KEY__NOME_OPERADOR, result.nomeoperador);

      setAccessToken(result.accessToken);
      setIdOperador(result.idoperador);
      setMessage(result.message);
      setNomeOperador(result.nomeoperador);
    }
  }, []);

  const handleLogout = useCallback(() => {
    Cookies.remove(COOKIE_KEY__ACCESS_TOKEN);
    Cookies.remove(COOKIE_KEY__ID_OPERADOR);
    Cookies.remove(COOKIE_KEY__MESSAGE);
    Cookies.remove(COOKIE_KEY__NOME_OPERADOR);

    setAccessToken(undefined);
    setIdOperador(undefined);
    setMessage(undefined);
    setNomeOperador(undefined);
  }, []);

  const isAuthenticated = useMemo(() => !!accessToken, [accessToken]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
