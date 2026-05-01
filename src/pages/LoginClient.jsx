import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { auth } from "../firebase/firebase";
import style from "../styles/Auth.module.css";

function LoginClient() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Введите email и пароль");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(auth, form.email, form.password);

      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);

      if (err.code === "auth/invalid-credential") {
        setError("Неверный email или пароль");
      } else {
        setError("Ошибка входа");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={style.authPage}>
      <form className={style.authCard} onSubmit={handleLogin}>
        <span>Limpopo</span>

        <h1>Вход</h1>

        <p>Войдите, чтобы заказать товар</p>

        {error && <div className={style.error}>{error}</div>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Вход..." : "Войти"}
        </button>

        <Link to="/register">Нет аккаунта? Зарегистрироваться</Link>
      </form>
    </main>
  );
}

export default LoginClient;