import { useAppSelector } from '@/hooks';
import { useNavigate, useParams } from 'react-router-dom';

import { Modal } from '@components/modal/modal';

import { OrderDetailsPage } from '../feed/order-details-page';

import type React from 'react';

export const OrderPage = (): React.JSX.Element => <OrderDetailsPage />;

export const OrderModal = (): React.ReactElement | null => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const feedOrders = useAppSelector((state) => state.ordersFeed.orders);
  const profileOrders = useAppSelector((state) => state.profileOrders.orders);
  const allOrders = [...feedOrders, ...profileOrders];
  const order = id
    ? allOrders.find((o) => o._id === id || String(o.number) === id)
    : undefined;

  const handleClose = (): void => {
    void navigate(-1);
  };

  if (!id) return null;

  const title = order ? `#${order.number}` : `#${id}`;

  return (
    <Modal title={title} onClose={handleClose}>
      <OrderDetailsPage />
    </Modal>
  );
};
