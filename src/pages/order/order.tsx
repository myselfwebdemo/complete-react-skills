import { useNavigate, useParams } from 'react-router-dom';

import { Modal } from '@components/modal/modal';

import { OrderDetailsPage } from '../feed/order-details-page';

import type React from 'react';

export const OrderPage = (): React.JSX.Element => <OrderDetailsPage />;

export const OrderModal = (): React.ReactElement | null => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleClose = (): void => {
    void navigate(-1);
  };

  if (!id) return null;

  return (
    <Modal title={`#${id}`} onClose={handleClose}>
      <OrderDetailsPage />
    </Modal>
  );
};
