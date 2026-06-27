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

      const currentUser = result.data.data;

      dispatch({
        type: "setUser",
        payload: currentUser,
      });
    } catch (err) {
      console.error("Fetch user error:", err);

      authService.logout();

      dispatch({
        type: "logout",
      });
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

    dispatch({
      type: "logout",
    });
  }

  async function register(email, password, fullName) {
    try {
      if (!fullName || !fullName.trim()) {
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

    try {
      const userData = {};
      const patientData = {};

      if ("name" in updatedData) userData.name = updatedData.name;
      if ("email" in updatedData) userData.email = updatedData.email;

      if ("phone" in updatedData) patientData.phone = updatedData.phone;
      if ("gender" in updatedData) patientData.gender = updatedData.gender;
      if ("birthDate" in updatedData)
        patientData.birthDate = updatedData.birthDate;

      let updatedUser = null;

      if (Object.keys(userData).length > 0) {
        const response = await authService.updateUser(user._id, userData);

        updatedUser = response.data.data;
      }

      let updatedPatient = null;

      if (Object.keys(patientData).length > 0) {
        const patientResponse = await patientService.updatePatient(
          user._id,
          patientData,
        );

        updatedPatient = patientResponse.data.patient;
      }

      dispatch({
        type: "updateUser",
        payload: {
          ...(updatedUser || {}),
          ...(updatedPatient && {
            patientProfile: updatedPatient,
          }),
        },
      });
    } catch (err) {
      console.error(err);

      throw new Error(i18n.t("auth.errors.failedUpdate"));
    }
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
