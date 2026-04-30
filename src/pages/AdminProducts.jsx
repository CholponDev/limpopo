import React, { useEffect, useState } from "react";
import style from "../styles/AdminProducts.module.css";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
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

  const [editingProductId, setEditingProductId] = useState(null);

const [productEditForm, setProductEditForm] = useState({
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

  const [productForm, setProductForm] = useState({
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

  const [brandForm, setBrandForm] = useState({
    title: "",
    description: "",
    logoUrl: "",
  });

  const [categoryForm, setCategoryForm] = useState({
    title: "",
    description: "",
  });

  const [editingBrandId, setEditingBrandId] = useState(null);
  const [brandEditForm, setBrandEditForm] = useState({
    title: "",
    description: "",
    logoUrl: "",
  });

  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryEditForm, setCategoryEditForm] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    const unsubscribeProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setProducts(sortByDate(data));
    });

    const unsubscribeBrands = onSnapshot(collection(db, "brands"), (snapshot) => {
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setBrands(sortByDate(data));
    });

    const unsubscribeCategories = onSnapshot(
      collection(db, "categories"),
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setCategories(sortByDate(data));
      }
    );

    return () => {
      unsubscribeProducts();
      unsubscribeBrands();
      unsubscribeCategories();
    };
  }, []);

  const sortByDate = (items) => {
    return [...items].sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
  };

  const createSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replaceAll(" ", "-")
      .replaceAll("ё", "е");
  };

  const getCategoryTitle = (categoryId, fallbackTitle) => {
    const category = categories.find((item) => item.id === categoryId);
    return category ? category.title : fallbackTitle;
  };

  const getBrandTitle = (brandId, fallbackTitle) => {
    const brand = brands.find((item) => item.id === brandId);
    return brand ? brand.title : fallbackTitle;
  };

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProductForm({
      ...productForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!productForm.title.trim()) {
      alert("Введите название товара");
      return;
    }

    if (!productForm.price) {
      alert("Введите цену товара");
      return;
    }

    if (!productForm.categoryId) {
      alert("Выберите категорию");
      return;
    }

    if (!productForm.brandId) {
      alert("Выберите бренд");
      return;
    }

    const selectedCategory = categories.find(
      (category) => category.id === productForm.categoryId
    );

    const selectedBrand = brands.find(
      (brand) => brand.id === productForm.brandId
    );

    try {
      await addDoc(collection(db, "products"), {
        title: productForm.title.trim(),

        categoryId: productForm.categoryId,
        categoryTitle: selectedCategory ? selectedCategory.title : "",

        brandId: productForm.brandId,
        brandTitle: selectedBrand ? selectedBrand.title : "",

        price: Number(productForm.price),
        oldPrice: productForm.oldPrice ? Number(productForm.oldPrice) : null,
        discountPercent: productForm.discountPercent
          ? Number(productForm.discountPercent)
          : null,

        imageUrl: productForm.imageUrl.trim(),
        description: productForm.description.trim(),

        isPopular: productForm.isPopular,
        isNew: productForm.isNew,
        isDiscount: productForm.isDiscount,

        createdAt: serverTimestamp(),
      });

      setProductForm({
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

  const startEditProduct = (product) => {
  setEditingProductId(product.id);

  setProductEditForm({
    title: product.title || "",
    categoryId: product.categoryId || "",
    brandId: product.brandId || "",
    price: product.price || "",
    oldPrice: product.oldPrice || "",
    discountPercent: product.discountPercent || "",
    imageUrl: product.imageUrl || "",
    description: product.description || "",
    isPopular: product.isPopular || false,
    isNew: product.isNew || false,
    isDiscount: product.isDiscount || false,
  });
};

const cancelEditProduct = () => {
  setEditingProductId(null);

  setProductEditForm({
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
};

const handleProductEditChange = (e) => {
  const { name, value, type, checked } = e.target;

  setProductEditForm({
    ...productEditForm,
    [name]: type === "checkbox" ? checked : value,
  });
};

const handleSaveProduct = async (id) => {
  if (!productEditForm.title.trim()) {
    alert("Введите название товара");
    return;
  }

  if (!productEditForm.price) {
    alert("Введите цену товара");
    return;
  }

  if (!productEditForm.categoryId) {
    alert("Выберите категорию");
    return;
  }

  if (!productEditForm.brandId) {
    alert("Выберите бренд");
    return;
  }

  const selectedCategory = categories.find(
    (category) => category.id === productEditForm.categoryId
  );

  const selectedBrand = brands.find(
    (brand) => brand.id === productEditForm.brandId
  );

  try {
    await updateDoc(doc(db, "products", id), {
      title: productEditForm.title.trim(),

      categoryId: productEditForm.categoryId,
      categoryTitle: selectedCategory ? selectedCategory.title : "",

      brandId: productEditForm.brandId,
      brandTitle: selectedBrand ? selectedBrand.title : "",

      price: Number(productEditForm.price),
      oldPrice: productEditForm.oldPrice
        ? Number(productEditForm.oldPrice)
        : null,
      discountPercent: productEditForm.discountPercent
        ? Number(productEditForm.discountPercent)
        : null,

      imageUrl: productEditForm.imageUrl.trim(),
      description: productEditForm.description.trim(),

      isPopular: productEditForm.isPopular,
      isNew: productEditForm.isNew,
      isDiscount: productEditForm.isDiscount,

      updatedAt: serverTimestamp(),
    });

    cancelEditProduct();
  } catch (error) {
    console.error("Ошибка редактирования товара:", error);
    alert("Не удалось сохранить изменения товара");
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

  const startEditBrand = (brand) => {
    setEditingBrandId(brand.id);

    setBrandEditForm({
      title: brand.title || "",
      description: brand.description || "",
      logoUrl: brand.logoUrl || "",
    });
  };

  const cancelEditBrand = () => {
    setEditingBrandId(null);

    setBrandEditForm({
      title: "",
      description: "",
      logoUrl: "",
    });
  };

  const handleSaveBrand = async (id) => {
    if (!brandEditForm.title.trim()) {
      alert("Название бренда не должно быть пустым");
      return;
    }

    try {
      await updateDoc(doc(db, "brands", id), {
        title: brandEditForm.title.trim(),
        description: brandEditForm.description.trim(),
        logoUrl: brandEditForm.logoUrl.trim(),
        slug: createSlug(brandEditForm.title),
        updatedAt: serverTimestamp(),
      });

      cancelEditBrand();
    } catch (error) {
      console.error("Ошибка редактирования бренда:", error);
      alert("Не удалось редактировать бренд");
    }
  };

  const handleDeleteBrand = async (id) => {
    const confirmDelete = window.confirm("Удалить этот бренд?");

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "brands", id));
    } catch (error) {
      console.error("Ошибка удаления бренда:", error);
      alert("Не удалось удалить бренд");
    }
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

  const startEditCategory = (category) => {
    setEditingCategoryId(category.id);

    setCategoryEditForm({
      title: category.title || "",
      description: category.description || "",
    });
  };

  const cancelEditCategory = () => {
    setEditingCategoryId(null);

    setCategoryEditForm({
      title: "",
      description: "",
    });
  };

  const handleSaveCategory = async (id) => {
    if (!categoryEditForm.title.trim()) {
      alert("Название категории не должно быть пустым");
      return;
    }

    try {
      await updateDoc(doc(db, "categories", id), {
        title: categoryEditForm.title.trim(),
        description: categoryEditForm.description.trim(),
        slug: createSlug(categoryEditForm.title),
        updatedAt: serverTimestamp(),
      });

      cancelEditCategory();
    } catch (error) {
      console.error("Ошибка редактирования категории:", error);
      alert("Не удалось редактировать категорию");
    }
  };

  const handleDeleteCategory = async (id) => {
    const confirmDelete = window.confirm("Удалить эту категорию?");

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "categories", id));
    } catch (error) {
      console.error("Ошибка удаления категории:", error);
      alert("Не удалось удалить категорию");
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
          <p>Товары, бренды и категории</p>
        </div>

        <button className={style.logoutBtn} onClick={handleLogout}>
          Выйти
        </button>
      </div>

      <div className={style.content}>
        <form className={style.form} onSubmit={handleAddProduct}>
          <h2>Добавить товар</h2>

          <input
            type="text"
            name="title"
            placeholder="Название товара"
            value={productForm.title}
            onChange={handleProductChange}
          />

          <select
            name="categoryId"
            value={productForm.categoryId}
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
            value={productForm.brandId}
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
            value={productForm.price}
            onChange={handleProductChange}
          />

          <input
            type="number"
            name="oldPrice"
            placeholder="Старая цена, если есть"
            value={productForm.oldPrice}
            onChange={handleProductChange}
          />

          <input
            type="number"
            name="discountPercent"
            placeholder="Скидка %, например 20"
            value={productForm.discountPercent}
            onChange={handleProductChange}
          />

          <input
            type="text"
            name="imageUrl"
            placeholder="Ссылка на фото товара"
            value={productForm.imageUrl}
            onChange={handleProductChange}
          />

          <textarea
            name="description"
            placeholder="Короткое описание товара"
            value={productForm.description}
            onChange={handleProductChange}
          />

          <div className={style.checks}>
            <label>
              <input
                type="checkbox"
                name="isPopular"
                checked={productForm.isPopular}
                onChange={handleProductChange}
              />
              Популярный товар
            </label>

            <label>
              <input
                type="checkbox"
                name="isNew"
                checked={productForm.isNew}
                onChange={handleProductChange}
              />
              Новинка
            </label>

            <label>
              <input
                type="checkbox"
                name="isDiscount"
                checked={productForm.isDiscount}
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
  {editingProductId === product.id ? (
    <div className={style.editBox}>
      <input
        type="text"
        name="title"
        placeholder="Название товара"
        value={productEditForm.title}
        onChange={handleProductEditChange}
      />

      <select
        name="categoryId"
        value={productEditForm.categoryId}
        onChange={handleProductEditChange}
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
        value={productEditForm.brandId}
        onChange={handleProductEditChange}
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
        value={productEditForm.price}
        onChange={handleProductEditChange}
      />

      <input
        type="number"
        name="oldPrice"
        placeholder="Старая цена"
        value={productEditForm.oldPrice}
        onChange={handleProductEditChange}
      />

      <input
        type="number"
        name="discountPercent"
        placeholder="Скидка %"
        value={productEditForm.discountPercent}
        onChange={handleProductEditChange}
      />

      <input
        type="text"
        name="imageUrl"
        placeholder="Ссылка на фото"
        value={productEditForm.imageUrl}
        onChange={handleProductEditChange}
      />

      <textarea
        name="description"
        placeholder="Описание товара"
        value={productEditForm.description}
        onChange={handleProductEditChange}
      />

      <div className={style.productEditChecks}>
        <label>
          <input
            type="checkbox"
            name="isPopular"
            checked={productEditForm.isPopular}
            onChange={handleProductEditChange}
          />
          Популярный
        </label>

        <label>
          <input
            type="checkbox"
            name="isNew"
            checked={productEditForm.isNew}
            onChange={handleProductEditChange}
          />
          Новинка
        </label>

        <label>
          <input
            type="checkbox"
            name="isDiscount"
            checked={productEditForm.isDiscount}
            onChange={handleProductEditChange}
          />
          Скидочный
        </label>
      </div>

      <div className={style.editActions}>
        <button type="button" onClick={() => handleSaveProduct(product.id)}>
          Сохранить
        </button>

        <button type="button" onClick={cancelEditProduct}>
          Отмена
        </button>
      </div>
    </div>
  ) : (
    <>
      <h3>{product.title}</h3>

      <p>
        Категория:{" "}
        {getCategoryTitle(product.categoryId, product.categoryTitle)}
      </p>

      <p>Бренд: {getBrandTitle(product.brandId, product.brandTitle)}</p>

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

      <div className={style.productActions}>
        <button
          type="button"
          className={style.editBtn}
          onClick={() => startEditProduct(product)}
        >
          Редактировать
        </button>

        <button
          type="button"
          className={style.deleteBtn}
          onClick={() => handleDeleteProduct(product.id)}
        >
          Удалить
        </button>
      </div>
    </>
  )}
</div>
              </article>
            ))}

            {filteredProducts.length === 0 && (
              <p className={style.empty}>Товаров пока нет</p>
            )}
          </div>
        </section>
      </div>

      <section className={style.catalogBlock}>
        <div className={style.catalogPanel}>
          <h2>Бренды</h2>

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
                {editingBrandId === brand.id ? (
                  <div className={style.editBox}>
                    <input
                      type="text"
                      value={brandEditForm.title}
                      onChange={(e) =>
                        setBrandEditForm({
                          ...brandEditForm,
                          title: e.target.value,
                        })
                      }
                    />

                    <input
                      type="text"
                      value={brandEditForm.logoUrl}
                      placeholder="Логотип"
                      onChange={(e) =>
                        setBrandEditForm({
                          ...brandEditForm,
                          logoUrl: e.target.value,
                        })
                      }
                    />

                    <textarea
                      value={brandEditForm.description}
                      onChange={(e) =>
                        setBrandEditForm({
                          ...brandEditForm,
                          description: e.target.value,
                        })
                      }
                    />

                    <div className={style.editActions}>
                      <button type="button" onClick={() => handleSaveBrand(brand.id)}>
                        Сохранить
                      </button>

                      <button type="button" onClick={cancelEditBrand}>
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={style.brandMini}>
                      {brand.logoUrl && (
                        <img src={brand.logoUrl} alt={brand.title} />
                      )}

                      <div>
                        <h3>{brand.title}</h3>
                        <p>{brand.description}</p>
                      </div>
                    </div>

                    <div className={style.itemActions}>
                      <button type="button" onClick={() => startEditBrand(brand)}>
                        Редактировать
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteBrand(brand.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {brands.length === 0 && (
              <p className={style.empty}>Брендов пока нет</p>
            )}
          </div>
        </div>

        <div className={style.catalogPanel}>
          <h2>Категории</h2>

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
                {editingCategoryId === category.id ? (
                  <div className={style.editBox}>
                    <input
                      type="text"
                      value={categoryEditForm.title}
                      onChange={(e) =>
                        setCategoryEditForm({
                          ...categoryEditForm,
                          title: e.target.value,
                        })
                      }
                    />

                    <textarea
                      value={categoryEditForm.description}
                      onChange={(e) =>
                        setCategoryEditForm({
                          ...categoryEditForm,
                          description: e.target.value,
                        })
                      }
                    />

                    <div className={style.editActions}>
                      <button
                        type="button"
                        onClick={() => handleSaveCategory(category.id)}
                      >
                        Сохранить
                      </button>

                      <button type="button" onClick={cancelEditCategory}>
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3>{category.title}</h3>
                      <p>{category.description}</p>
                    </div>

                    <div className={style.itemActions}>
                      <button
                        type="button"
                        onClick={() => startEditCategory(category)}
                      >
                        Редактировать
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {categories.length === 0 && (
              <p className={style.empty}>Категорий пока нет</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdminProducts;