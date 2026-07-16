import { useAppSelector } from '@/hooks';
import {
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import type { TIngredient } from '@utils/types';
import type React from 'react';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  selectedBun: TIngredient | null;
  onRemoveIngredient: (uniqueId: string) => void;
  moveIngredient: (from: number, to: number) => void;
  onOpenOrder: () => Promise<void>;
  canOrder: boolean;
  onAddIngredient: (ingredientId: string) => void;
};

type TConstructorItemProps = {
  item: TIngredient;
  index?: number;
  blocked?: boolean;
  onRemove?: () => void;
  moveIngredient?: (from: number, to: number) => void;
  type?: 'top-bun' | 'bottom-bun';
};

const ConstructorItem = ({
  item,
  index,
  blocked,
  onRemove,
  moveIngredient,
  type,
}: TConstructorItemProps): React.JSX.Element => {
  const ref = useRef<HTMLLIElement>(null);

  const [, drop] = useDrop({
    accept: 'constructorItem',
    hover(dragged: { index: number }) {
      if (dragged.index === undefined || index === undefined) return;
      if (dragged.index === index) return;
      if (!ref.current) return;
      moveIngredient?.(dragged.index, index);
      dragged.index = index;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'constructorItem',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <li
      ref={ref}
      className={`${styles.constructor_item} ${blocked ? styles.blocked : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {!blocked && (
        <div className={styles.drag_icon}>
          <DragIcon type={blocked ? 'secondary' : 'primary'} />
        </div>
      )}

      <ConstructorElement
        type={type === 'top-bun' ? 'top' : type === 'bottom-bun' ? 'bottom' : undefined}
        isLocked={blocked}
        text={
          type === 'top-bun'
            ? `${item.name} (верх)`
            : type === 'bottom-bun'
              ? `${item.name} (низ)`
              : item.name
        }
        price={item.price}
        thumbnail={item.image}
        handleClose={onRemove}
      />
    </li>
  );
};

export const BurgerConstructor = ({
  selectedBun,
  onRemoveIngredient,
  moveIngredient,
  onOpenOrder,
  canOrder,
  onAddIngredient,
}: TBurgerConstructorProps): React.JSX.Element => {
  const ingredients = useAppSelector((store) => store.burgerConstructor.ingredients);
  const constructorItemsData = ingredients.filter((item) => item.type !== 'bun');

  const totalPrice =
    constructorItemsData.reduce((sum, item) => sum + item.price, 0) +
    (selectedBun ? selectedBun.price * 2 : 0);

  const topBunDropRef = useRef<HTMLDivElement>(null);
  const bottomBunDropRef = useRef<HTMLDivElement>(null);
  const ingredientsDropRef = useRef<HTMLUListElement>(null);

  const [, topBunDrop] = useDrop({
    accept: 'ingredient',
    drop(item: { ingredientId: string; type: string }) {
      if (item.type === 'bun') {
        onAddIngredient(item.ingredientId);
      }
    },
  });

  const [, bottomBunDrop] = useDrop({
    accept: 'ingredient',
    drop(item: { ingredientId: string; type: string }) {
      if (item.type === 'bun') {
        onAddIngredient(item.ingredientId);
      }
    },
  });

  const [, ingredientsDrop] = useDrop({
    accept: 'ingredient',
    drop(item: { ingredientId: string; type: string }) {
      if (item.type !== 'bun') {
        onAddIngredient(item.ingredientId);
      }
    },
  });

  topBunDrop(topBunDropRef);
  bottomBunDrop(bottomBunDropRef);
  ingredientsDrop(ingredientsDropRef);

  return (
    <section className={styles.burger_constructor} data-testid="burger-constructor">
      <div ref={topBunDropRef} data-testid="bun-dropzone-top">
        {selectedBun ? (
          <ConstructorItem item={selectedBun} type="top-bun" blocked />
        ) : (
          <div className={`${styles.placeholder} ${styles.top_item_bun}`}>
            Добавьте булку (верх)
          </div>
        )}
      </div>

      <div className={styles.scrollable_wrapper}>
        <ul
          ref={ingredientsDropRef}
          className={styles.constructor_list}
          data-testid="constructor-ingredients-dropzone"
        >
          {constructorItemsData.length > 0 ? (
            constructorItemsData.map((item, index) => (
              <ConstructorItem
                key={item.uniqueId}
                item={item}
                index={index}
                onRemove={() => onRemoveIngredient(item.uniqueId)}
                moveIngredient={moveIngredient}
              />
            ))
          ) : (
            <div className={styles.placeholder}>Добавьте ингредиенты</div>
          )}
        </ul>
      </div>

      <div ref={bottomBunDropRef} data-testid="bun-dropzone-bottom">
        {selectedBun ? (
          <ConstructorItem item={selectedBun} type="bottom-bun" blocked />
        ) : (
          <div className={`${styles.placeholder} ${styles.bottom_item_bun}`}>
            Добавьте булку (низ)
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.total}>
          <p className="text text_type_digits-default">{totalPrice}</p>
          <CurrencyIcon type="primary" />
        </div>
        <button
          type="button"
          className={`button button_type_primary button_size_medium ${styles.order_btn}`}
          onClick={() => void onOpenOrder()}
          disabled={!canOrder}
        >
          Оформить заказ
        </button>
      </div>
    </section>
  );
};
