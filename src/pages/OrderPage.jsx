import React, { useEffect, useState } from "react";
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { Link, useNavigate, useParams } from "react-router-dom";

import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import style from "../styles/Order.module.css";

function OrderPage() {
  const { productId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    quantity: 1,
    comment: "",
  });

  useEffect(() => {
    const getProduct = async () => {
      try {
        const productRef = doc(db, "products", productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProduct({
            id: productSnap.id,
            ...productSnap.data(),
          });
        } else {
          setError("Товар не найден");
        }
      } catch (err) {
        console.error(err);
        setError("Ошибка загрузки товара");
      } finally {
        setPageLoading(false);
      }
    };

    getProduct();
  }, [productId]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.phone || !form.address) {
      setError("Заполните имя, телефон и адрес");
      return;
    }

    if (!product) {
      setError("Товар не найден");
      return;
    }

    try {
      setOrderLoading(true);

      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        userEmail: user.email,

        productId: product.id,
        productTitle: product.title,
        productImage: product.imageUrl || "",
        productPrice: Number(product.price) || 0,

        customerName: form.name,
        customerPhone: form.phone,
        customerAddress: form.address,
        quantity: Number(form.quantity) || 1,
        comment: form.comment,

        status: "new",
        createdAt: serverTimestamp(),
      });

      alert("Заказ успешно отправлен");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Ошибка при оформлении заказа");
    } finally {
      setOrderLoading(false);
    }
  };

  if (pageLoading) {
    return <p className={style.loading}>Загрузка товара...</p>;
  }

  if (error && !product) {
    return (
      <main className={style.orderPage}>
        <div className={style.orderCard}>
          <h1>{error}</h1>
          <Link to="/">На главную</Link>
        </div>
      </main>
    );
  }

  return (
    <main className={style.orderPage}>
      <form className={style.orderCard} onSubmit={handleOrder}>
        <Link to="/" className={style.backLink}>
          ← Назад
        </Link>

        <span>Оформление заказа</span>

        <h1>{product.title}</h1>

        {product.imageUrl && (
          <img className={style.productImg} src={product.imageUrl} alt={product.title} />
        )}

        <p className={style.price}>{product.price} сом</p>

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
          type="text"
          name="address"
          placeholder="Адрес доставки"
          value={form.address}
          onChange={handleChange}
        />

        <input
          type="number"
          name="quantity"
          min="1"
          placeholder="Количество"
          value={form.quantity}
          onChange={handleChange}
        />

        <textarea
          name="comment"
          placeholder="Комментарий к заказу"
          value={form.comment}
          onChange={handleChange}
        />

        <button type="submit" disabled={orderLoading}>
          {orderLoading ? "Отправка..." : "Заказать товар"}
        </button>
      </form>
    </main>
  );
}

export default OrderPage;