import { createContext, useContext, useReducer, useEffect } from "react";
import i18n from "../i18n";

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
        user: { ...state.user, ...action.payload },
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

  // ✅ Fetch current user
  async function fetchCurrentUser() {
    const token = localStorage.getItem("token");

    if (!token) {
      dispatch({ type: "stopLoading" });
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        logout();
        return;
      }

      const result = await res.json();
      const user = result?.data?.data;

      if (!user) {
        logout();
        return;
      }

      dispatch({ type: "setUser", payload: user });
    } catch (err) {
      console.error("Fetch user error:", err);
      logout();
    }
  }

  // ✅ Login
  async function login(email, password) {
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      const { token } = data;

      localStorage.setItem("token", token);

      await fetchCurrentUser();
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  }

  function getToken() {
    return localStorage.getItem("token");
  }

  // ✅ Logout
  function logout() {
    localStorage.removeItem("token");
    dispatch({ type: "logout" });
  }

  // ✅ Restore session
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  //  Register ( الجديد الحقيقي)
  async function register(email, password, fullName) {
    try {
      if (!fullName || !fullName.trim())
        throw new Error(i18n.t("auth.errors.fullNameRequired"));

      if (password.length < 8)
        throw new Error(i18n.t("auth.errors.passwordLength"));

      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
        }),
      });

      const data = await res.json();

      // ❌ Error handling
      if (!res.ok) {
        const message = data.message || "";

        // ✅ detect duplicate email بشكل ذكي
        if (
          message.toLowerCase().includes("duplicate") ||
          message.toLowerCase().includes("email")
        ) {
          throw new Error("Email already exists. Please use another one.");
        }

        throw new Error(message || "Register failed");
      }

      const { token } = data;

      // ✅ نفس login تماماً
      localStorage.setItem("token", token);

      // ✅ نجيب المستخدم الحقيقي
      await fetchCurrentUser();
    } catch (err) {
      console.error("Register error:", err);
      throw err;
    }
  }

  function setUser(updatedData) {
    dispatch({ type: "updateUser", payload: updatedData });
  }

  async function updateUser(updatedData) {
    if (!user) throw new Error(i18n.t("auth.errors.noUser"));

    const res = await fetch(`http://localhost:3000/api/user/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) throw new Error(i18n.t("auth.errors.failedUpdate"));

    const updatedUser = await res.json();

    dispatch({ type: "updateUser", payload: updatedUser });
  }

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
  if (context === undefined)
    throw new Error("AuthContext was used outside AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
