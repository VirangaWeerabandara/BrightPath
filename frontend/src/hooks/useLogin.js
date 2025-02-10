import { useState } from "react";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("http://localost:3000/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setIsLoading(false);
    }
    if (response.ok) {
      //save user in local storage
      localStorage.setItem("user", JSON.stringify(json));

      // update local state
      setUser(json);
      setIsLoading(false);
    }
  };

  return { login, loading, error, user };
};
