import React, { useEffect, useMemo, useState } from "react";
import style from "../styles/Home.module.css";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

import penguinImg from "../assets/penguin.png";

function Home() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);

  const [activeSlide, setActiveSlide] = useState(0);

  const sortByDate = (items) => {
    return [...items].sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
  };

  useEffect(() => {
    const unsubscribeCategories = onSnapshot(
      collection(db, "categories"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCategories(sortByDate(data));
      }
    );

    const unsubscribeBrands = onSnapshot(
      collection(db, "brands"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBrands(sortByDate(data));
      }
    );

    const unsubscribeProducts = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(sortByDate(data));
      }
    );

    return () => {
      unsubscribeCategories();
      unsubscribeBrands();
      unsubscribeProducts();
    };
  }, []);

  const heroSlides = [
    {
      badge: "Beauty",
      smallText: "Care shop",
      title: "Уход каждый день",
      text: "Для лица, тела, волос и вашей уверенности.",
      image: null,
    },
    {
      badge: "Limpopo",
      smallText: "Karakol",
      title: "Пингвин выбрал Лимпопо",
      text: `🐧 Он шёл несколько километров. В неизвестность.
Без карты, без обещаний — просто потому, что верил: там его ждёт что-то важное.
Дорога была длинной, холодной, непонятной…
но он дошёл.
    И знаете куда?
    В «Лимпопо» 🛍️💖
Место, где помогают найти своё: уход, красоту и уверенность в себе.
Если даже пингвин не побоялся пути и выбрал «Лимпопо»,
значит, вы точно на верной дороге ✨

📍 Ждём вас в магазине косметики «Лимпопо»
— здесь всегда подскажут и подберут с любовью.`,
      image: penguinImg,
    },
  ];

  const currentSlide = heroSlides[activeSlide];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) =>
      prev === 0 ? heroSlides.length - 1 : prev - 1
    );
  };

  const popularProducts = useMemo(() => {
    return products.filter((product) => product.isPopular).slice(0, 8);
  }, [products]);

  const newProducts = useMemo(() => {
    return products.filter((product) => product.isNew).slice(0, 8);
  }, [products]);

  const discountProducts = useMemo(() => {
    return products.filter((product) => product.isDiscount).slice(0, 8);
  }, [products]);

  const mainProducts = useMemo(() => {
    if (popularProducts.length > 0) return popularProducts;
    return products.slice(0, 8);
  }, [products, popularProducts]);

  return (
    <main className={style.home} id="home">
      <section className={style.hero}>
        <div className={style.heroContent}>
          <span className={style.label}>Limpopo Karakol</span>

          <h1>Косметика и уходовые средства для вашей красоты</h1>

          <p>
            Уход для лица, тела, волос, декоративная косметика, парфюмерия и
            товары для дома в одном месте.
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

        <div
          className={`${style.heroSlider} ${
            currentSlide.image ? style.heroSliderWithBg : ""
          }`}
          style={
            currentSlide.image
              ? {
                  backgroundImage: `linear-gradient(
                rgba(25, 8, 30, 0.25),
              rgba(25, 8, 30, 0.38)
                  ), url(${currentSlide.image})`,
                }
              : undefined
          }
        >
          <div className={style.slideTop}>
            <span>{currentSlide.badge}</span>
            <p>{currentSlide.smallText}</p>
          </div>

          <div className={style.slideContent}>
            <h3>{currentSlide.title}</h3>
            <p>{currentSlide.text}</p>
          </div>

          {activeSlide === 0 && (
            <div className={style.miniCards}>
              <div>
                <strong>{categories.length}</strong>
                <span>Категорий</span>
              </div>

              <div>
                <strong>{brands.length}</strong>
                <span>Брендов</span>
              </div>

              <div>
                <strong>{products.length}</strong>
                <span>Товаров</span>
              </div>
            </div>
          )}

          <div className={style.sliderControls}>
            <button type="button" onClick={prevSlide}>
              ←
            </button>

            <div className={style.dots}>
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={activeSlide === index ? style.activeDot : ""}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>

            <button type="button" onClick={nextSlide}>
              →
            </button>
          </div>
        </div>
      </section>

      <section className={style.categories} id="categories">
        <div className={style.sectionHeader}>
          <span>Категории</span>
          <h2>Подберите товары по направлению</h2>
          <p>
            Категории добавляются, удаляются и редактируются через админ-панель.
          </p>
        </div>

        <div className={style.categoryGrid}>
          {categories.map((category, index) => (
            <article className={style.categoryCard} key={category.id}>
              <div className={style.categoryNumber}>{index + 1}</div>

              <h3>{category.title}</h3>

              <p>
                {category.description ||
                  "Товары этой категории можно добавить через админ-панель."}
              </p>

              <a href="#products">Смотреть товары</a>
            </article>
          ))}

          {categories.length === 0 && (
            <p className={style.empty}>
              Категорий пока нет. Добавьте их в админ-панели.
            </p>
          )}
        </div>
      </section>

      <section className={style.productsSection} id="products">
        <div className={style.sectionHeader}>
          <span>Товары</span>
          <h2 id="popular">Популярные товары</h2>
          <p>
            Товары появляются здесь после добавления через админ-страницу.
          </p>
        </div>

        <div className={style.productsGrid}>
          {mainProducts.map((product) => (
            <article className={style.productCard} key={product.id}>
              {product.isDiscount && product.discountPercent && (
                <span className={style.discountBadge}>
                  -{product.discountPercent}%
                </span>
              )}

              {product.isNew && <span className={style.newBadge}>New</span>}

              <div className={style.productImage}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.title} />
                ) : (
                  <span>Нет фото</span>
                )}
              </div>

              <div className={style.productInfo}>
                <h3>{product.title}</h3>

                {product.brandTitle && <p>Бренд: {product.brandTitle}</p>}

                {product.categoryTitle && (
                  <p>Категория: {product.categoryTitle}</p>
                )}

                <div className={style.priceBox}>
                  <strong>{product.price} сом</strong>

                  {product.oldPrice && <span>{product.oldPrice} сом</span>}
                </div>
              </div>
            </article>
          ))}

          {products.length === 0 && (
            <p className={style.empty}>
              Товаров пока нет. Добавьте товары в админ-панели.
            </p>
          )}
        </div>
      </section>

      {newProducts.length > 0 && (
        <section className={style.productsSection} id="new">
          <div className={style.sectionHeader}>
            <span>Новинки</span>
            <h2>Новые поступления</h2>
          </div>

          <div className={style.productsGrid}>
            {newProducts.map((product) => (
              <article className={style.productCard} key={product.id}>
                <span className={style.newBadge}>New</span>

                <div className={style.productImage}>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.title} />
                  ) : (
                    <span>Нет фото</span>
                  )}
                </div>

                <div className={style.productInfo}>
                  <h3>{product.title}</h3>

                  <div className={style.priceBox}>
                    <strong>{product.price} сом</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {discountProducts.length > 0 && (
        <section className={style.productsSection} id="discont">
          <div className={style.sectionHeader}>
            <span>Скидки</span>
            <h2>Скидочные товары</h2>
          </div>

          <div className={style.productsGrid}>
            {discountProducts.map((product) => (
              <article className={style.productCard} key={product.id}>
                {product.discountPercent && (
                  <span className={style.discountBadge}>
                    -{product.discountPercent}%
                  </span>
                )}

                <div className={style.productImage}>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.title} />
                  ) : (
                    <span>Нет фото</span>
                  )}
                </div>

                <div className={style.productInfo}>
                  <h3>{product.title}</h3>

                  <div className={style.priceBox}>
                    <strong>{product.price} сом</strong>

                    {product.oldPrice && <span>{product.oldPrice} сом</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className={style.brands} id="brands">
        <div className={style.brandsInfo}>
          <span>Бренды</span>
          <h2>Бренды, с которыми работает магазин</h2>
          <p>
            Список брендов берётся из Firebase. Если удалить бренд в админке,
            он исчезнет и с главной страницы.
          </p>
        </div>

        <div className={style.brandList}>
          {brands.map((brand) => (
            <div className={style.brandItem} key={brand.id}>
              {brand.logoUrl && <img src={brand.logoUrl} alt={brand.title} />}

              <span>{brand.title}</span>
            </div>
          ))}

          {brands.length === 0 && (
            <p className={style.empty}>
              Брендов пока нет. Добавьте их в админ-панели.
            </p>
          )}
        </div>
      </section>

      <section className={style.giveaway}>
        <div className={style.giveawayContent}>
          <span>Розыгрыши</span>

          <h2>Следите за новыми розыгрышами</h2>

          <p>
            Здесь можно публиковать розыгрыши, подарочные наборы, условия
            участия и ссылку на Instagram.
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