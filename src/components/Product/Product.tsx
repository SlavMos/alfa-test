import React, { useEffect, useState } from "react";
import s from "./Product.module.css";
import ProductCard from "../ProductCard/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  toggleLike,
  toggleShowFavorites,
  deleteProduct,
} from "../../redux/slices/productsSlice";
import { RootState, AppDispatch } from "../../redux/store";

const Products: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.items);
  const status = useSelector((state: RootState) => state.products.status);
  const showFavorites = useSelector(
    (state: RootState) => state.products.showFavorites
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Для строки поиска
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage, limit: itemsPerPage }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleToggleFavorites = () => {
    dispatch(toggleShowFavorites());
  };

  // Фильтрация продуктов
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return showFavorites ? product.liked && matchesSearch : matchesSearch;
  });

  if (status === "loading") {
    return <p>Загрузка продуктов...</p>;
  }

  if (status === "failed") {
    return <p>Ошибка при загрузке продуктов.</p>;
  }

  return (
    <div className={s.productsContainer}>
      <div className={s.controls}>
        <button className={s.filterButton} onClick={handleToggleFavorites}>
          {showFavorites ? "Показать все" : "Показать избранное"}
        </button>
        <input
          type="text"
          placeholder="Поиск продуктов"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={s.searchInput}
        />
      </div>

      <div className={s.productsList}>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onLike={() => dispatch(toggleLike(product.id))}
            onDelete={() => dispatch(deleteProduct(product.id))}
          />
        ))}
      </div>
      <div className={s.pagination}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Назад
        </button>
        <span>Страница {currentPage}</span>
        <button onClick={() => handlePageChange(currentPage + 1)}>
          Вперёд
        </button>
      </div>
    </div>
  );
};

export default Products;
