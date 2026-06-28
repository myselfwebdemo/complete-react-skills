import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import BurgerIngredients from '@components/burger-ingredients/burger-ingredients';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/modal/order-details';

import {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} from '../../features/burgerConstructor/burgerConstructorSlice';
import { createOrder } from '../../features/order/orderSlice';

import type { RootState, AppDispatch } from '../../store';
import type React from 'react';

import styles from './home.module.css';

export const Home = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const ingredients = useSelector((s: RootState) => s.ingredients.items);
  const status = useSelector((s: RootState) => s.ingredients.status);
  const error = useSelector((s: RootState) => s.ingredients.error);
  const burgerConstructor = useSelector((s: RootState) => s.burgerConstructor);
  const orderNumber = useSelector((s: RootState) => s.order.number);
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);

  const [isOrderModalOpen, setOrderModalOpen] = useState(false);

  const handleAddIngredient = (ingredientId: string): void => {
    const ingredient = ingredients.find((item) => item._id === ingredientId);
    if (!ingredient) return;

    if (ingredient.type === 'bun') {
      void dispatch(addBun(ingredient));
      return;
    }

    void dispatch(addIngredient(ingredient));
  };

  const handleSelectIngredient = (ingredientId: string): void => {
    void navigate(`/ingredients/${ingredientId}`, {
      state: { backgroundLocation: location },
    });
  };

  const canOrder =
    burgerConstructor.bun !== null && burgerConstructor.ingredients.length > 0;

  const handleOpenOrderModal = async (): Promise<void> => {
    if (!canOrder || !burgerConstructor.bun) return;

    if (!isAuthenticated) {
      void navigate('/login', { state: { from: location } });
      return;
    }

    const payload = [
      burgerConstructor.bun._id,
      ...burgerConstructor.ingredients.map((ing) => ing._id),
      burgerConstructor.bun._id,
    ];

    try {
      await dispatch(createOrder(payload)).unwrap();
      void dispatch(clearConstructor());
      setOrderModalOpen(true);
    } catch (err) {
      alert(err ?? 'Ошибка при создании заказа');
    }
  };

  const handleCloseOrderModal = (): void => setOrderModalOpen(false);

  const handleRemoveIngredient = (uniqueId: string): void => {
    void dispatch(removeIngredient(uniqueId));
  };

  const getIngredientCount = (ingredientId: string): number => {
    const ingredient = ingredients.find((item) => item._id === ingredientId);
    if (!ingredient) return 0;
    if (ingredient.type === 'bun') {
      return burgerConstructor.bun?._id === ingredientId ? 1 : 0;
    }
    return burgerConstructor.ingredients.filter((item) => item._id === ingredientId)
      .length;
  };

  const handleMoveIngredient = (from: number, to: number): void => {
    void dispatch(moveIngredient({ from, to }));
  };

  if (status === 'loading') return <Preloader />;

  if (error) {
    console.log(error);
    return (
      <div className={styles.home}>
        <div className={styles.error_block}>
          <p className="text text_type_main-default">Ошибка загрузки ингредиентов:</p>
          <p className="text text_type_main-default">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.home}>
        <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
          Соберите бургер
        </h1>

        <main className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients
            onSelectIngredient={handleSelectIngredient}
            getIngredientCount={getIngredientCount}
          />
          <BurgerConstructor
            selectedBun={burgerConstructor.bun}
            onRemoveIngredient={handleRemoveIngredient}
            moveIngredient={handleMoveIngredient}
            onOpenOrder={() => void handleOpenOrderModal()}
            canOrder={canOrder}
            onAddIngredient={handleAddIngredient}
          />
        </main>

        {isOrderModalOpen && (
          <Modal title={`#${orderNumber ?? ''}`} onClose={handleCloseOrderModal}>
            <OrderDetails orderNumber={orderNumber ?? ''} />
          </Modal>
        )}
      </div>
    </DndProvider>
  );
};
