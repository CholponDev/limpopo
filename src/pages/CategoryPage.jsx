import React, { useEffect, useState } from "react";
import style from "../styles/CategoryPage.module.css";

import { Link, useParams } from "react-router-dom";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

function CategoryPage() {
  const { categoryId } = useParams();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);

  const sortByDate = (items) => {
    return [...items].sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
  };

  useEffect(() => {
    if (!categoryId) return;

    const unsubscribeCategory = onSnapshot(
      doc(db, "categories", categoryId),
      (snapshot) => {
        if (snapshot.exists()) {
          setCategory({
            id: snapshot.id,
            ...snapshot.data(),
          });
        } else {
          setCategory(null);
        }
      }
    );

    const unsubscribeProducts = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        const filteredProducts = data.filter(
          (product) => product.categoryId === categoryId
        );

        setProducts(sortByDate(filteredProducts));
      }
    );

    return () => {
      unsubscribeCategory();
      unsubscribeProducts();
    };
  }, [categoryId]);

  return (
    <main className={style.page}>
      <section className={style.hero}>
        <Link to="/" className={style.backLink}>
          ← На главную
        </Link>

        <span>Категория</span>

        <h1>{category ? category.title : "Категория не найдена"}</h1>

        <p>
          {category?.description ||
            "Здесь будут отображаться товары этой категории."}
        </p>
      </section>

      <section className={style.productsSection}>
        <div className={style.sectionHeader}>
          <h2>Товары категории</h2>
          <p>Всего товаров: {products.length}</p>
        </div>

        <div className={style.productsGrid}>
          {products.map((product) => (
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

                {product.description && <p>{product.description}</p>}

                <div className={style.priceBox}>
                  <strong>{product.price} сом</strong>

                  {product.oldPrice && <span>{product.oldPrice} сом</span>}
                </div>
              </div>
            </article>
          ))}

          {products.length === 0 && (
            <div className={style.empty}>
              <h3>Пока нет товаров</h3>
              <p>
                Когда вы добавите товар в админке и выберете эту категорию, он
                появится здесь.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default CategoryPage;