import React from "react";
import style from "../styles/Home.module.css";

function Home() {
  const categories = [
    {
      title: "Для лица",
      text: "Кремы, маски, сыворотки и ежедневный уход для кожи лица.",
    },
    {
      title: "Уход за кожей",
      text: "Средства для очищения, увлажнения и восстановления кожи.",
    },
    {
      title: "Для тела",
      text: "Лосьоны, кремы, гели и уходовые средства для тела.",
    },
    {
      title: "Для волос",
      text: "Шампуни, бальзамы, маски и средства для красоты волос.",
    },
    {
      title: "Уход за волосами",
      text: "Питание, восстановление, защита и ежедневный уход.",
    },
    {
      title: "Косметика для ухода",
      text: "Практичные средства для ежедневной заботы о себе.",
    },
    {
      title: "Косметика для красоты",
      text: "Декоративная косметика для макияжа и выразительного образа.",
    },
    {
      title: "Парфюмерия",
      text: "Ароматы для себя и в подарок: женские и мужские парфюмы.",
    },
  ];

  const brands = [
    "L'Oréal",
    "Maybelline",
    "Garnier",
    "Nivea",
    "Dove",
    "Eveline",
    "Syoss",
    "Elseve",
    "Bielita",
    "Compliment",
    "Faberlic",
    "Avon",
  ];

  return (
    <main className={style.home} id="home">
      <section className={style.hero}>
        <div className={style.heroContent}>
          {/* <span className={style.label}>Limpopo Karakol</span> */}

          <h1>
            Косметика и уходовые средства для вашей красоты
          </h1>

          <p>
            Подберите уход для лица, тела, волос, а также косметику,
            парфюмерию и товары для дома в одном месте.
          </p>

          <div className={style.heroActions}>
            <a href="#products" className={style.primaryBtn}>
              Смотреть товары
            </a>

            <a href="#brands" className={style.secondaryBtn}>
              Наши бренды
            </a>
          </div>
        </div>

        <div className={style.heroCard}>
          <div className={style.cardTop}>
            <span>New</span>
            <p>Beauty care</p>
          </div>

          <h3>Уход каждый день</h3>
          <p>
            Для лица, тела, волос и вашей уверенности.
          </p>

          <div className={style.miniCards}>
            <div>
              <strong>Face</strong>
              <span>Уход</span>
            </div>

            <div>
              <strong>Hair</strong>
              <span>Волосы</span>
            </div>

            <div>
              <strong>Perfume</strong>
              <span>Ароматы</span>
            </div>
          </div>
        </div>
      </section>

      <section className={style.categories} id="products">
        <div className={style.sectionHeader}>
          {/* <span>Категории</span> */}
          <h2>Подберите товары по направлению</h2>
          <p>
            Разделы помогут быстро найти нужный уход, косметику или подарок.
          </p>
        </div>

        <div className={style.categoryGrid}>
          {categories.map((item, index) => (
            <article className={style.categoryCard} key={index}>
              <div className={style.categoryNumber}>
                {index + 1}
              </div>

              <h3>{item.title}</h3>
              <p>{item.text}</p>

              <button>Посмотреть</button>
            </article>
          ))}
        </div>
      </section>

      <section className={style.brands} id="brands">
        <div className={style.brandsInfo}>
          <span>Бренды</span>
          <h2>Товары популярных брендов</h2>
          <p>
            Здесь можно показать бренды, с которыми работает магазин.
            Список ниже примерный — замени его на реальные бренды Limpopo.
          </p>
        </div>

        <div className={style.brandList}>
          {brands.map((brand, index) => (
            <div className={style.brandItem} key={index}>
              {brand}
            </div>
          ))}
        </div>
      </section>

      <section className={style.giveaway}>
        <div className={style.giveawayContent}>
          <span>Розыгрыши</span>

          <h2>Следите за новыми розыгрышами</h2>

          <p>
            В этом разделе можно публиковать условия розыгрышей,
            подарочные наборы, даты итогов и ссылку на Instagram.
          </p>

          <a
            href="https://www.instagram.com/limpopo_karakol/"
            target="_blank"
            rel="noreferrer"
          >
            Перейти в Instagram
          </a>
        </div>

        <div className={style.giveawayBox}>
          <p>Подарочный набор</p>
          <h3>Beauty Box</h3>
          <span>Скоро новый розыгрыш</span>
        </div>
      </section>
    </main>
  );
}

export default Home;