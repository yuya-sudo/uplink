import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiFillStar } from 'react-icons/ai';
import Price from '../Price';
import styles from './NewestProduct.module.css';
import { calculateDiscountPercent } from '../../utils/utils';

const NewestProduct = ({ product }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (!product) return null;

  const { _id, name, price, originalPrice, image, stars, reviewCount } = product;
  const discountPercent = calculateDiscountPercent(price, originalPrice);

  return (
    <section className={`section ${styles.newestSection}`}>
      <div className={`container ${styles.newestContainer}`}>
        <div className={styles.badgeContainer}>
          <span className={styles.newBadge}>New Arrival</span>
        </div>

        <div className={`${styles.productCard} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              <img src={image} alt={name} />
            </div>
          </div>

          <div className={styles.contentSection}>
            <h2 className={styles.productTitle}>{name}</h2>

            <div className={styles.rating}>
              <span className={styles.stars}>
                {stars} <AiFillStar />
              </span>
              <span className={styles.reviews}>({reviewCount} reviews)</span>
            </div>

            <div className={styles.priceSection}>
              <Price amount={price} />
              {discountPercent > 0 && (
                <>
                  <Price amount={originalPrice} />
                  <span className={styles.discount}>{discountPercent}% off</span>
                </>
              )}
            </div>

            <Link to={`/products/${_id}`} className={`btn ${styles.viewBtn}`}>
              View Product
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewestProduct;
