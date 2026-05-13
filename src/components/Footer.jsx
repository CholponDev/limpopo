import React from "react";
import styles from "../styles/Footer.module.css";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.contacts}>
            <h3 className={styles.title}>Контакты</h3>

            <p className={styles.text}>Кыргызстан, г. Каракол</p>
            <p className={styles.text}>Жамансариева 190</p>
            <p className={styles.text}>+996 773 886 363</p>

            <div className={styles.socials}>
              <a
                href="https://wa.me/996773886363"
                target="_blank"
                rel="noreferrer"
                className={styles.icon}
              >
                <FaWhatsapp />
                <span>WhatsApp</span>
              </a>

              <a
                href="https://www.instagram.com/limpopo_karakol/"
                target="_blank"
                rel="noreferrer"
                className={styles.icon}
              >
                <FaInstagram />
                <span>Instagram</span>
              </a>
            </div>
          </div>

          <div className={styles.mapBox}>
            <h3 className={styles.title}>Мы на карте</h3>

            <iframe
              className={styles.map}
              src="https://www.google.com/maps?q=Karakol%20Zhamansarieva%20190&output=embed"
              loading="lazy"
              title="map"
            ></iframe>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        © {new Date().getFullYear()} Все права защищены.
      </div>
    </footer>
  );
};

export default Footer;