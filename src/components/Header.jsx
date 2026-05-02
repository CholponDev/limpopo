import React, { useState } from "react";
import style from "../styles/Header.module.css";
import img from "../assets/logo.png";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();

    console.log("Поиск:", search);
    console.log("Фильтр:", filter);
  };

  return (
    <header className={style.header}>
      <div className={style.topLine}>
        <p>Уход, который подчёркивает вашу естественную красоту</p>
      </div>

      <div className={style.container}>
        <Link to="/" className={style.logoBox}>
          <div className={style.logoIcon}>
            <img src={img} alt="logo" />
          </div>

          <div className={style.logoText}>
            <h2> <a href="#home">Limpopo</a></h2>
            <p>karakol</p>
          </div>
        </Link>

        <nav className={style.nav}>
          {/* <a href="#home">Главная</a> */}

          <form className={style.searchBox} onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Поиск товара..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Категории</option>
              <option value="cosmetics">Косметика</option>
              <option value="face">Для лица</option>
              <option value="mask">Маски</option>
              <option value="hair">Для волос</option>
              <option value="body">Для тела</option>
              <option value="hand">Для рук</option>
              <option value="perfume">Парфюм</option>
              <option value="brush">Кисти</option>
            </select>

            <button type="submit">Найти</button>
          </form>

          <a href="#products">Товары</a>
          {/* <a href="#popular">Популярные</a> */}
          {/* <a href="#brands">Бренды</a> */}
          <a href="#new">Новинки</a>
          <a href="#discount">Скидки</a>
          <a href="#contact">Контакты</a>
        </nav>

        <div className={style.actions}>
          {user ? (
            <div className={style.userBox}>
              <span className={style.userEmail}>{user.email}</span>

              <button
                type="button"
                className={style.logoutBtn}
                onClick={logout}
              >
                Выйти
              </button>
            </div>
          ) : (
            <div className={style.authButtons}>
              <Link to="/login" className={style.loginBtn}>
                Войти
              </Link>

              <Link to="/register" className={style.registerBtn}>
                Регистрация
              </Link>
            </div>
          )}

          <a
            className={style.instaBtn}
            href="https://www.instagram.com/limpopo_karakol/"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;