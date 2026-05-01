import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

import { auth, db } from "../firebase/firebase";
import style from "../styles/Auth.module.css";

function RegisterClient() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.phone || !form.email || !form.password) {
      setError("Заполните все поля");
      return;
    }

    if (form.password.length < 6) {
      setError("Пароль должен быть минимум 6 символов");
      return;
    }

    try {
      setLoading(true);

      const result = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: form.name,
        phone: form.phone,
        email: form.email,
        role: "client",
        createdAt: serverTimestamp(),
      });

      navigate("/");
    } catch (err) {
      console.error(err);

      if (err.code === "auth/email-already-in-use") {
        setError("Этот email уже зарегистрирован");
      } else if (err.code === "auth/invalid-email") {
        setError("Неверный email");
      } else {
        setError("Ошибка регистрации");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={style.authPage}>
      <form className={style.authCard} onSubmit={handleRegister}>
        <span>Клиент</span>

        <h1>Регистрация</h1>

        <p>Создайте аккаунт, чтобы заказать товар</p>

        {error && <div className={style.error}>{error}</div>}

        <input
          type="text"
          name="name"
          placeholder="Ваше имя"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="tel"
          name="phone"
          placeholder="Телефон"
          value={form.phone}
          onChange={handleChange}
        />

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
          {loading ? "Регистрация..." : "Зарегистрироваться"}
        </button>

        <Link to="/login">Уже есть аккаунт? Войти</Link>
      </form>
    </main>
  );
}

export default RegisterClient;