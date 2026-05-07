import React, { useEffect, useMemo, useState } from "react";
import style from "../styles/Home.module.css";
import img from "../assets/lim.png";

import { Link } from "react-router-dom";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
const categoryImages = {
  "для лица":
    "https://i.pinimg.com/736x/e4/07/fa/e407fa0a9013804d87bfa25ec67b8bfc.jpg",
  "для тела":
    "https://i.pinimg.com/736x/92/e8/4b/92e84b879c064bf8fc7439b74d75a4fd.jpg",
  "для волос":
    "https://i.pinimg.com/1200x/52/9d/ce/529dcef9fb09292f0de374c9a2e9b9e7.jpg",
  "декоративная косметика":
    "https://i.pinimg.com/736x/61/04/db/6104db756638cc715acd0faf9f5cd756.jpg",
  "сумки и косметички":
    "https://i.pinimg.com/736x/85/94/ec/8594ec02d6019751c42066f6b9514fad.jpg",
  "парфюмерия":
    "https://i.pinimg.com/736x/27/db/ce/27dbce8e2e0d7863fdcac773a18b776e.jpg",
  "подарочные наборы":
    "https://i.pinimg.com/1200x/0d/83/8c/0d838c09fed26177547935a054bdaa19.jpg"
};
function Home() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);

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

  const renderProductCard = (product) => {
    return (
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

          <Link to={`/order/${product.id}`} className={style.orderBtn}>
            Заказать
          </Link>
        </div>
      </article>
    );
  };

  return (
    <main className={style.home} id="home">
     <section className={style.hero}>
  <div className={style.heroContent}>
    <div className={style.heroTextBox}>
      <h1 className={style.heroTitle}>
        Limpopo
        <span>Karakol</span>
      </h1>

      <p className={style.heroSlogan}>Магазин красоты</p>

      <p className={style.heroInfo}>
        16 лет • 1000+ довольных клиентов
      </p>

      <p className={style.heroCategories}>
        Корейская косметика · Парфюмы · Дом
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

    <div className={style.heroImageBox}>
      <img className={style.image} src={img} alt="Limpopo Karakol" />
    </div>
  </div>
</section>
 <div className={style.categoriesWrapper}>
        <h2>Категории магазина</h2>
        

        <div className={style.categoriesSlider}>
          {categories.map((cat) => (
            <Link
              to={`/category/${cat.id}`}
              key={cat.id}
              className={style.categoryCard}
            >
              <img
                src={
                  categoryImages[cat.title?.toLowerCase()] || cat.imageUrl
                }
                alt={cat.title}
                className={style.categoryImage}
              />

              <p className={style.categoryTitle}>{cat.title}</p>
            </Link>
          ))}
        </div>
      </div>

      <section className={style.productsSection} id="products">
        <div className={style.sectionHeader}>
          <span>Товары</span>

          <h2 id="popular">Популярные товары</h2>

          <p>Популярный уход для вашей красоты и настроения.</p>
        </div>

        <div className={style.productsGrid}>
          {mainProducts.map((product) => renderProductCard(product))}

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

            <p>Свежие товары, которые недавно появились в магазине.</p>
          </div>

          <div className={style.productsGrid}>
            {newProducts.map((product) => renderProductCard(product))}
          </div>
        </section>
      )}

      {discountProducts.length > 0 && (
        <section className={style.productsSection} id="discount">
          <div className={style.sectionHeader}>
            <span>Скидки</span>

            <h2>Скидочные товары</h2>

            <p>Товары со специальной ценой и выгодными предложениями.</p>
          </div>

          <div className={style.productsGrid}>
            {discountProducts.map((product) => renderProductCard(product))}
          </div>
        </section>
      )}

      <section className={style.brands} id="brands">
        <div className={style.brandsInfo}>
          <span>Бренды</span>

          <h2>Бренды, с которыми работает магазин</h2>

          <p>Бренды, которым доверяют в уходе и красоте.</p>
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