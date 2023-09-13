"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useNotificationContext } from "./notificationContext";
import axios from "axios-base";
import { useCookies } from "react-cookie";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [cookies, removeCookie] = useCookies(["gotiretoken"]);
  const { setError, setAlert, setContentLoad } = useNotificationContext();
  const [user, setUser] = useState(null);
  const [isRedirect, setIsRedirect] = useState(false);
  const [code, setCode] = useState(false);
  const [isPassword, setIsPassword] = useState(false);

  useEffect(() => {
    if (cookies.gotiretoken) {
      checkToken(cookies.gotiretoken);
    }
  }, [cookies.gotiretoken]);

  const checkToken = (token) => {
    axios
      .post("users/checktoken", {
        withCredentials: true,
        headers: { Cookie: `gotiretoken=${token}` },
      })
      .then((result) => {
        if (!user) {
          setUser(result.data.user);
        }
      })
      .catch((error) => {
        logOut();
      });
  };

  const logOut = () => {
    axios.get("users/logout").catch((error) => {});
    setCode(false);
    setUser(null);
    setIsPassword(false);
    setIsRedirect(false);
    removeCookie("gotiretoken");
  };

  const loginUser = (data) => {
    setContentLoad(true);
    axios
      .post("users/login", data)
      .then((result) => {
        setUser(result.data.user);
        setAlert("Амжилттай нэвтэрлээ");
        setContentLoad(false);
      })
      .catch((error) => {
        setError(error);
        setContentLoad(false);
      });
  };

  const userRegister = (formData) => {
    setContentLoad(true);
    axios
      .post("users/register", formData)
      .then((result) => {
        setAlert("Бүртгэл амжилттай хийгдлээ");
        setContentLoad(false);
        setIsRedirect(true);
      })
      .catch((error) => {
        setError(error);
        setContentLoad(false);
        setIsRedirect(false);
      });
  };

  const getUser = () => {
    if (!user && cookies.gotiretoken) {
      setContentLoad(true);
      axios
        .get(`users/userdata`, {
          withCredentials: true,
          headers: { Cookie: `gotiretoken=${cookies.gotiretoken}` },
        })
        .then((res) => {
          setUser(res.data.data);
          setContentLoad(false);
        })
        .catch((error) => {
          setError(error);
          setContentLoad(false);
        });
    }
  };

  const phoneCheck = async (phoneNumber) => {
    setCode(false);
    setContentLoad(true);
    axios
      .post("users/forgot-password", phoneNumber)
      .then((result) => {
        setAlert("Бүртгэлтэй утасны дугаарлуу баталгаажуулах код илгээлээ ");
        setCode(true);
      })
      .catch((error) => {
        setError(error);
        setCode(false);
      });
  };

  const forgetPassword = (body) => {
    if (code === true) {
      setContentLoad(true);
      axios
        .post("users/reset-password", body)
        .then((result) => {
          setAlert("Нууц үг амжилттай солигдлоо");
          setContentLoad(false);
          setIsPassword(true);
        })
        .catch((error) => {
          setError(error);
          setContentLoad(false);
          setIsPassword(false);
        });
    }
  };

  const userChangePassword = (data) => {
    setContentLoad(true);
    axios
      .post("users/userdata", data)
      .then((res) => {
        setUser(res.data.data);
        setContentLoad(false);
      })
      .catch((error) => {
        setContentLoad(false);
        setError(errorRender(error));
      });
    clear();
  };

  const userInfoChange = (values) => {
    setContentLoad(true);
    axios
      .put("users/userdata", values)
      .then((res) => {
        setUser(res.data.data);
        setContentLoad(false);
      })
      .catch((error) => {
        setContentLoad(false);
        setError(error);
      });
    clear();
  };

  const checkUser = async () => {
    const token = cookies.gotiretoken;
    if (!token) {
      setError("Уучлаарай нэвтэрч орно уу");
      return false;
    }

    try {
      const result = await axios.get(`users/userdata`, {
        withCredentials: true,
        headers: { Cookie: `gotiretoken=${token}` },
      });

      return true;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        logOut,
        loginUser,
        userRegister,
        userChangePassword,
        userInfoChange,
        getUser,
        code,
        setCode,
        user,
        phoneCheck,
        forgetPassword,
        isPassword,
        setIsPassword,
        isRedirect,
        setIsRedirect,
        checkUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
