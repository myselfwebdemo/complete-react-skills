import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './order-details.module.css';

type TOrderDetailsProps = {
  orderNumber: string;
};

export const OrderDetails = ({ orderNumber }: TOrderDetailsProps): React.JSX.Element => (
  <div className={styles.order_container}>
    <p className={`text text_type_digits-large ${styles.order_number}`}>{orderNumber}</p>
    <div className={styles.order_icon_wrap}>
      <CheckMarkIcon type="primary" />
    </div>
    <p className={`text text_type_main-default ${styles.order_text}`}>
      Ваш заказ начали готовить
    </p>
    <p
      className={`text text_type_main-default text_color_inactive ${styles.order_subtext}`}
    >
      Дождитесь готовности на орбитальной станции
    </p>
  </div>
);

export default OrderDetails;
