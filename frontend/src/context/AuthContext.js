import React, { useState, createContext } from 'react';
import { useHistory } from 'react-router-dom';
const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
  const history = useHistory();
  // best to put this into a useEffect hook
  // const token = localStorage.getItem("token");
  const userInfo = localStorage.getItem('userInfo');
  const expiresAt = localStorage.getItem('expiresAt');
  const [authState, setAuthState] = useState({
    token: null,
    expiresAt,
    userInfo: userInfo ? JSON.parse(userInfo) : {}
  });

  const setAuthInfo = ({ token, userInfo, expiresAt }) => {
    // replaced with cookie
    // localStorage.setItem("token", token);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    localStorage.setItem('expiresAt', expiresAt);
    setAuthState({ token, userInfo, expiresAt });
  };

  const logout = () => {
    // localStorage.removeItem("token");
    localStorage.removeItem('userInfo');
    localStorage.removeItem('expiresAt');
    setAuthState({ token: null, expiresAt: null, userInfo: {} });
    history.push('/login');
  };

  const isAuthenticated = () => {
    if (!authState.token || !authState.expiresAt) {
      return false;
    }
    // need to divide by 1000 as getTime() returns milliseconds, expiresAt is in seconds
    return new Date().getTime() / 1000 < authState.expiresAt;
  };

  const isAdmin = () => {
    return authState.userInfo.role === 'admin';
  };
  return (
    <Provider
      value={{
        authState,
        setAuthState: (authInfo) => setAuthInfo(authInfo),
        isAuthenticated,
        logout,
        isAdmin
      }}
    >
      {children}
    </Provider>
  );
};

export { AuthContext, AuthProvider };
