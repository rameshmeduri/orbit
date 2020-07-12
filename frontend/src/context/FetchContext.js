import React, { createContext, useEffect, useContext } from 'react';
// import { AuthContext } from "../context/AuthContext";
import axios from 'axios';

const FetchContext = createContext();
const { Provider } = FetchContext;

const FetchProvider = ({ children }) => {
  // const authContext = useContext(AuthContext);
  const authAxios = axios.create({
    baseURL: process.env.REACT_APP_API_URL
  });

  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await authAxios.get('/csrf-token');
      authAxios.defaults.headers['X-CSRF-Token'] = data.csrfToken;
    };
    getCsrfToken();
  }, []);

  // token/localstorage
  // authAxios.interceptors.request.use(
  //   (config) => {
  //     // 'Bearer' is a scheme in OAuth
  //     config.headers.Authorization = `Bearer ${authContext.token}`;
  //     return config;
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   }
  // );

  return (
    <Provider value={{authAxios}}>{children}</Provider>
  );
};

export { FetchContext, FetchProvider };
