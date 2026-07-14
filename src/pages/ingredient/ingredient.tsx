import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import { IngredientDetails } from '@components/modal/ingredient-details';
import { Modal } from '@components/modal/modal';

import {
  addBun,
  addIngredient,
} from '../../features/burgerConstructor/burgerConstructorSlice';

import type { RootState, AppDispatch } from '../../store';
import type React from 'react';

import styles from './ingredient.module.css';

export const IngredientPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const ingredients = useSelector((s: RootState) => s.ingredients.items);

  const ingredient = ingredients.find((item) => item._id === id);
  const status = useSelector((s: RootState) => s.ingredients.status);

  const handleAddIngredient = (): void => {
    if (!ingredient) return;

    if (ingredient.type === 'bun') {
      void dispatch(addBun(ingredient));
    } else {
      void dispatch(addIngredient(ingredient));
    }

    void navigate('/');
  };

  if (status === 'loading') {
    return <Preloader />;
  }

  if (!ingredient) {
    return (
      <div className={styles.ingredient_page}>
        <p className="text text_type_main-default">Ингредиент не найден</p>
      </div>
    );
  }

  return (
    <div className={styles.ingredient_page}>
      <IngredientDetails ingredient={ingredient} onAdd={handleAddIngredient} />
    </div>
  );
};

export const IngredientModal = (): React.ReactElement | null => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const ingredients = useSelector((s: RootState) => s.ingredients.items);
  const status = useSelector((s: RootState) => s.ingredients.status);

  const ingredient = ingredients.find((item) => item._id === id);

  const handleClose = (): void => {
    void navigate(-1);
  };

  const handleAddIngredient = (): void => {
    if (!ingredient) return;

    if (ingredient.type === 'bun') {
      void dispatch(addBun(ingredient));
    } else {
      void dispatch(addIngredient(ingredient));
    }

    void navigate(-1);
  };

  if (status === 'loading') {
    return <Preloader />;
  }

  if (!ingredient) {
    return null;
  }

  return (
    <Modal title="Детали ингредиента" onClose={handleClose}>
      <IngredientDetails ingredient={ingredient} onAdd={handleAddIngredient} />
    </Modal>
  );
};
