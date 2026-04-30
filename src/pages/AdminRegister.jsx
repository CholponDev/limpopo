import React, { useState } from "react";
import style from "../styles/AdminRegister.module.css";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

import { useNavigate, Link } from "react-router-dom";

function AdminRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Заполните все поля");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const user = res.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: form.name,
        email: form.email,
        role: "admin",
        createdAt: serverTimestamp(),
      });

      navigate("/admin");
    } catch (error) {
      console.error(error);

      if (error.code === "auth/email-already-in-use") {
        setError("Этот email уже зарегистрирован");
      } else if (error.code === "auth/weak-password") {
        setError("Пароль должен быть минимум 6 символов");
      } else {
        setError("Ошибка регистрации администратора");
      }
    }
  };

  return (
    <div className={style.page}>
      <form className={style.form} onSubmit={handleRegister}>
        <h2>Регистрация администратора</h2>
        <p>Создайте админ-аккаунт для управления товарами</p>

        {error && <div className={style.error}>{error}</div>}

        <input
          type="text"
          name="name"
          placeholder="Имя администратора"
          value={form.name}
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

        <button type="submit">Зарегистрироваться</button>

        <span>
          Уже есть аккаунт? <Link to="/admin-login">Войти</Link>
        </span>
      </form>
    </div>
  );
}

export default AdminRegister;