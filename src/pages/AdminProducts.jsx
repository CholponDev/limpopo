import React, { useEffect, useState } from "react";
import style from "../styles/AdminProducts.module.css";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [filter, setFilter] = useState("all");

  const [categoryForm, setCategoryForm] = useState({
    title: "",
    description: "",
  });

  const [brandForm, setBrandForm] = useState({
    title: "",
    description: "",
    logoUrl: "",
  });

  const [form, setForm] = useState({
    title: "",
    categoryId: "",
    brandId: "",
    price: "",
    oldPrice: "",
    discountPercent: "",
    imageUrl: "",
    description: "",
    isPopular: false,
    isNew: false,
    isDiscount: false,
  });

  useEffect(() => {
    const productsQuery = query(
      collection(db, "products"),
      orderBy("createdAt", "desc")
    );

    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(data);
    });

    const categoriesQuery = query(
      collection(db, "categories"),
      orderBy("createdAt", "desc")
    );

    const unsubscribeCategories = onSnapshot(categoriesQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCategories(data);
    });

    const brandsQuery = query(
      collection(db, "brands"),
      orderBy("createdAt", "desc")
    );

    const unsubscribeBrands = onSnapshot(brandsQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBrands(data);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeCategories();
      unsubscribeBrands();
    };
  }, []);

  const createSlug = (text) => {
    return text.toLowerCase().trim().replaceAll(" ", "-").replaceAll("ё", "е");
  };

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!categoryForm.title.trim()) {
      alert("Введите название категории");
      return;
    }

    try {
      await addDoc(collection(db, "categories"), {
        title: categoryForm.title.trim(),
        description: categoryForm.description.trim(),
        slug: createSlug(categoryForm.title),
        createdAt: serverTimestamp(),
      });

      setCategoryForm({
        title: "",
        description: "",
      });
    } catch (error) {
      console.error("Ошибка добавления категории:", error);
      alert("Не удалось добавить категорию");
    }
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();

    if (!brandForm.title.trim()) {
      alert("Введите название бренда");
      return;
    }

    try {
      await addDoc(collection(db, "brands"), {
        title: brandForm.title.trim(),
        description: brandForm.description.trim(),
        logoUrl: brandForm.logoUrl.trim(),
        slug: createSlug(brandForm.title),
        createdAt: serverTimestamp(),
      });

      setBrandForm({
        title: "",
        description: "",
        logoUrl: "",
      });
    } catch (error) {
      console.error("Ошибка добавления бренда:", error);
      alert("Не удалось добавить бренд");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Введите название товара");
      return;
    }

    if (!form.price) {
      alert("Введите цену товара");
      return;
    }

    if (!form.categoryId) {
      alert("Выберите категорию");
      return;
    }

    if (!form.brandId) {
      alert("Выберите бренд");
      return;
    }

    const selectedCategory = categories.find(
      (category) => category.id === form.categoryId
    );

    const selectedBrand = brands.find((brand) => brand.id === form.brandId);

    try {
      await addDoc(collection(db, "products"), {
        title: form.title.trim(),

        categoryId: form.categoryId,
        categoryTitle: selectedCategory ? selectedCategory.title : "",

        brandId: form.brandId,
        brandTitle: selectedBrand ? selectedBrand.title : "",

        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        discountPercent: form.discountPercent
          ? Number(form.discountPercent)
          : null,

        imageUrl: form.imageUrl.trim(),
        description: form.description.trim(),

        isPopular: form.isPopular,
        isNew: form.isNew,
        isDiscount: form.isDiscount,

        createdAt: serverTimestamp(),
      });

      setForm({
        title: "",
        categoryId: "",
        brandId: "",
        price: "",
        oldPrice: "",
        discountPercent: "",
        imageUrl: "",
        description: "",
        isPopular: false,
        isNew: false,
        isDiscount: false,
      });
    } catch (error) {
      console.error("Ошибка добавления товара:", error);
      alert("Не удалось добавить товар");
    }
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm("Удалить этот товар?");

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "products", id));
    } catch (error) {
      console.error("Ошибка удаления товара:", error);
      alert("Не удалось удалить товар");
    }
  };

  const handleDeleteCategory = async (id) => {
    const confirmDelete = window.confirm("Удалить категорию?");

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "categories", id));
    } catch (error) {
      console.error("Ошибка удаления категории:", error);
      alert("Не удалось удалить категорию");
    }
  };

  const handleDeleteBrand = async (id) => {
    const confirmDelete = window.confirm("Удалить бренд?");

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "brands", id));
    } catch (error) {
      console.error("Ошибка удаления бренда:", error);
      alert("Не удалось удалить бренд");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin-login");
  };

  const filteredProducts = products.filter((product) => {
    if (filter === "all") return true;
    if (filter === "popular") return product.isPopular;
    if (filter === "new") return product.isNew;
    if (filter === "discount") return product.isDiscount;

    return product.categoryId === filter;
  });

  return (
    <main className={style.page}>
      <div className={style.header}>
        <div>
          <h1>Админ-панель Limpopo</h1>
          <p>Категории, бренды и товары в одной странице</p>
        </div>

        <button className={style.logoutBtn} onClick={handleLogout}>
          Выйти
        </button>
      </div>

      <section className={style.catalogGrid}>
        <div className={style.catalogPanel}>
          <h2>Добавить категорию</h2>

          <form className={style.smallForm} onSubmit={handleAddCategory}>
            <input
              type="text"
              placeholder="Например: Для лица"
              value={categoryForm.title}
              onChange={(e) =>
                setCategoryForm({
                  ...categoryForm,
                  title: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Описание категории"
              value={categoryForm.description}
              onChange={(e) =>
                setCategoryForm({
                  ...categoryForm,
                  description: e.target.value,
                })
              }
            />

            <button type="submit">Добавить категорию</button>
          </form>

          <div className={style.miniList}>
            {categories.map((category) => (
              <div className={style.miniItem} key={category.id}>
                <div>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                </div>

                <button onClick={() => handleDeleteCategory(category.id)}>
                  Удалить
                </button>
              </div>
            ))}

            {categories.length === 0 && (
              <p className={style.empty}>Категорий пока нет</p>
            )}
          </div>
        </div>

        <div className={style.catalogPanel}>
          <h2>Добавить бренд</h2>

          <form className={style.smallForm} onSubmit={handleAddBrand}>
            <input
              type="text"
              placeholder="Название бренда"
              value={brandForm.title}
              onChange={(e) =>
                setBrandForm({
                  ...brandForm,
                  title: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Ссылка на логотип бренда"
              value={brandForm.logoUrl}
              onChange={(e) =>
                setBrandForm({
                  ...brandForm,
                  logoUrl: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Описание бренда"
              value={brandForm.description}
              onChange={(e) =>
                setBrandForm({
                  ...brandForm,
                  description: e.target.value,
                })
              }
            />

            <button type="submit">Добавить бренд</button>
          </form>

          <div className={style.miniList}>
            {brands.map((brand) => (
              <div className={style.miniItem} key={brand.id}>
                <div className={style.brandMini}>
                  {brand.logoUrl && <img src={brand.logoUrl} alt={brand.title} />}

                  <div>
                    <h3>{brand.title}</h3>
                    <p>{brand.description}</p>
                  </div>
                </div>

                <button onClick={() => handleDeleteBrand(brand.id)}>
                  Удалить
                </button>
              </div>
            ))}

            {brands.length === 0 && (
              <p className={style.empty}>Брендов пока нет</p>
            )}
          </div>
        </div>
      </section>

      <div className={style.content}>
        <form className={style.form} onSubmit={handleAddProduct}>
          <h2>Добавить товар</h2>

          <input
            type="text"
            name="title"
            placeholder="Название товара"
            value={form.title}
            onChange={handleProductChange}
          />

          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleProductChange}
          >
            <option value="">Выберите категорию</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>

          <select
            name="brandId"
            value={form.brandId}
            onChange={handleProductChange}
          >
            <option value="">Выберите бренд</option>

            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.title}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="price"
            placeholder="Цена"
            value={form.price}
            onChange={handleProductChange}
          />

          <input
            type="number"
            name="oldPrice"
            placeholder="Старая цена, если есть"
            value={form.oldPrice}
            onChange={handleProductChange}
          />

          <input
            type="number"
            name="discountPercent"
            placeholder="Скидка %, например 20"
            value={form.discountPercent}
            onChange={handleProductChange}
          />

          <input
            type="text"
            name="imageUrl"
            placeholder="Ссылка на фото товара"
            value={form.imageUrl}
            onChange={handleProductChange}
          />

          <textarea
            name="description"
            placeholder="Короткое описание товара"
            value={form.description}
            onChange={handleProductChange}
          />

          <div className={style.checks}>
            <label>
              <input
                type="checkbox"
                name="isPopular"
                checked={form.isPopular}
                onChange={handleProductChange}
              />
              Популярный товар
            </label>

            <label>
              <input
                type="checkbox"
                name="isNew"
                checked={form.isNew}
                onChange={handleProductChange}
              />
              Новинка
            </label>

            <label>
              <input
                type="checkbox"
                name="isDiscount"
                checked={form.isDiscount}
                onChange={handleProductChange}
              />
              Скидочный товар
            </label>
          </div>

          <button type="submit">Добавить товар</button>
        </form>

        <section className={style.productsSide}>
          <div className={style.filterBox}>
            <h2>Товары</h2>

            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Все товары</option>
              <option value="popular">Популярные</option>
              <option value="new">Новинки</option>
              <option value="discount">Скидки</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          <div className={style.productsGrid}>
            {filteredProducts.map((product) => (
              <article className={style.card} key={product.id}>
                {product.isDiscount && product.discountPercent && (
                  <span className={style.discountBadge}>
                    -{product.discountPercent}%
                  </span>
                )}

                {product.isNew && <span className={style.newBadge}>New</span>}

                <div className={style.imageBox}>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.title} />
                  ) : (
                    <span>Нет фото</span>
                  )}
                </div>

                <div className={style.cardInfo}>
                  <h3>{product.title}</h3>

                  {product.categoryTitle && (
                    <p>Категория: {product.categoryTitle}</p>
                  )}

                  {product.brandTitle && <p>Бренд: {product.brandTitle}</p>}

                  {product.description && (
                    <p className={style.description}>{product.description}</p>
                  )}

                  <div className={style.priceBox}>
                    <strong>{product.price} сом</strong>

                    {product.oldPrice && <span>{product.oldPrice} сом</span>}
                  </div>

                  <div className={style.tags}>
                    {product.isPopular && <small>Популярный</small>}
                    {product.isNew && <small>Новинка</small>}
                    {product.isDiscount && <small>Скидка</small>}
                  </div>

                  <button
                    className={style.deleteBtn}
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Удалить
                  </button>
                </div>
              </article>
            ))}

            {filteredProducts.length === 0 && (
              <p className={style.empty}>Товаров пока нет</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminProducts;