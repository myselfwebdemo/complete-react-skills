import { useAppSelector } from '@/hooks';
import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useRef, useState } from 'react';

import IngredientCard from './ingredient-item';

import type React from 'react';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  onSelectIngredient: (ingredientId: string) => void;
  getIngredientCount: (ingredientId: string) => number;
};

function BurgerIngredients({
  onSelectIngredient,
  getIngredientCount,
}: TBurgerIngredientsProps): React.JSX.Element {
  const ingredients = useAppSelector((store) => store.ingredients.items);
  const [active, setActive] = useState<'bun' | 'sauce' | 'main'>('bun');

  const buns = ingredients.filter((i) => i.type === 'bun');
  const sauces = ingredients.filter((i) => i.type === 'sauce');
  const mains = ingredients.filter((i) => i.type === 'main');

  const contentRef = useRef<HTMLDivElement | null>(null);
  const refBuns = useRef<HTMLElement | null>(null);
  const refSauces = useRef<HTMLElement | null>(null);
  const refMains = useRef<HTMLElement | null>(null);

  const handleTabClick = (value: 'bun' | 'sauce' | 'main'): void => {
    setActive(value);
    const map = { bun: refBuns, sauce: refSauces, main: refMains };
    const el = map[value].current;
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const sections: {
      ref: React.RefObject<HTMLElement | null>;
      value: 'bun' | 'sauce' | 'main';
    }[] = [
      { ref: refBuns, value: 'bun' },
      { ref: refSauces, value: 'sauce' },
      { ref: refMains, value: 'main' },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (!visibleSection) return;

        const found = sections.find(
          (section) => section.ref.current === visibleSection.target
        );
        if (found) setActive(found.value);
      },
      { root: content, threshold: [0.45, 0.55] }
    );

    sections.forEach((section) => {
      if (section.ref.current) observer.observe(section.ref.current);
    });

    return (): void => observer.disconnect();
  }, []);

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab
            value="bun"
            active={active === 'bun'}
            onClick={() => handleTabClick('bun')}
          >
            Булки
          </Tab>
          <Tab
            value="sauce"
            active={active === 'sauce'}
            onClick={() => handleTabClick('sauce')}
          >
            Соусы
          </Tab>
          <Tab
            value="main"
            active={active === 'main'}
            onClick={() => handleTabClick('main')}
          >
            Начинки
          </Tab>
        </ul>
      </nav>

      <div ref={contentRef} className={styles.content}>
        <section ref={refBuns} className={styles.group}>
          <h2 className="text text_type_main-medium">Булки</h2>
          <ul className={styles.list}>
            {buns.map((item) => (
              <IngredientCard
                key={item._id}
                item={item}
                count={getIngredientCount(item._id)}
                onSelect={onSelectIngredient}
              />
            ))}
          </ul>
        </section>

        <section ref={refSauces} className={styles.group}>
          <h2 className="text text_type_main-medium">Соусы</h2>
          <ul className={styles.list}>
            {sauces.map((item) => (
              <IngredientCard
                key={item._id}
                item={item}
                count={getIngredientCount(item._id)}
                onSelect={onSelectIngredient}
              />
            ))}
          </ul>
        </section>

        <section ref={refMains} className={styles.group}>
          <h2 className="text text_type_main-medium">Начинки</h2>
          <ul className={styles.list}>
            {mains.map((item) => (
              <IngredientCard
                key={item._id}
                item={item}
                count={getIngredientCount(item._id)}
                onSelect={onSelectIngredient}
              />
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}

export default BurgerIngredients;
