import { createContext, useContext, useReducer, useEffect } from "react";

import i18n from "../i18n";

import authService from "../api/authService";
import patientService from "../api/patientService";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
    case "register":
    case "setUser":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };

    case "logout":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case "stopLoading":
      return {
        ...state,
        isLoading: false,
      };

    case "updateUser":
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };

    default:
      throw new Error("Unknown action");
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated, isLoading }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  async function fetchCurrentUser() {
    try {
      const result = await authService.getCurrentUser();

      dispatch({
        type: "setUser",
        payload: result.data.data,
      });
      console.log("CURRENT USER", result.data);
    } catch (err) {
      authService.logout();
      dispatch({ type: "logout" });
    }
  }

  async function login(email, password) {
    try {
      await authService.login(email, password);

      await fetchCurrentUser();
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  }
  function logout() {
    authService.logout();
    dispatch({ type: "logout" });
  }
  async function register(email, password, fullName) {
    try {
      if (!fullName.trim()) {
        throw new Error(i18n.t("auth.errors.fullNameRequired"));
      }

      if (password.length < 8) {
        throw new Error(i18n.t("auth.errors.passwordLength"));
      }

      await authService.register(fullName, email, password);

      await fetchCurrentUser();
    } catch (err) {
      console.error("Register error:", err);
      throw err;
    }
  }
  function setUser(updatedData) {
    dispatch({
      type: "updateUser",
      payload: updatedData,
    });
  }

  async function updateUser(updatedData) {
    if (!user) {
      throw new Error(i18n.t("auth.errors.noUser"));
    }

    const result = await authService.updateUser(user._id, updatedData);

    dispatch({
      type: "updateUser",
      payload: result.data.data,
    });
  }

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        register,
        updateUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("AuthContext was used outside AuthProvider");
  }

  return context;
}

export { AuthProvider, useAuth };
