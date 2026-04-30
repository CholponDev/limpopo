import React, { useState } from "react";
import style from "../styles/AdminLogin.module.css";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const userRef = doc(db, "users", res.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().role === "admin") {
        navigate("/admin");
      } else {
        await signOut(auth);
        setError("У вас нет доступа к админ-панели");
      }
    } catch (error) {
      console.error(error);
      setError("Неверный email или пароль");
    }
  };

  return (
    <div className={style.page}>
      <form className={style.form} onSubmit={handleLogin}>
        <h2>Вход для администратора</h2>
        <p>Только админ может добавлять и удалять товары</p>

        {error && <div className={style.error}>{error}</div>}

        <input
          type="email"
          name="email"
          placeholder="Email админа"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Войти</button>
      </form>
    </div>
  );
}

export default AdminLogin;