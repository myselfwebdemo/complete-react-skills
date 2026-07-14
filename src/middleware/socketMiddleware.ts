import { getRawAccessToken } from '../utils/auth';
import { isValidWSOrdersResponse, type TWSOrdersResponse } from '../utils/orders';

import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import type { AnyAction, Dispatch } from 'redux';

export type TSocketActions = {
  wsConnect: string;
  wsDisconnect: string;
  wsOpen: string;
  wsClose: string;
  wsError: string;
  wsMessage: string;
};

type TSocketMiddlewareConfig = {
  actions: TSocketActions;
  getUrl: () => string;
};

const createWebSocketMiddleware = ({
  actions,
  getUrl,
}: TSocketMiddlewareConfig): Middleware => {
  let socket: WebSocket | null = null;

  return (store: MiddlewareAPI<Dispatch<AnyAction>, unknown>) =>
    (next: (action: unknown) => unknown) =>
    (action: unknown): unknown => {
      const typedAction = action as AnyAction;
      const result = next(typedAction);

      if (typedAction.type === actions.wsConnect) {
        if (socket) {
          if (socket.readyState === WebSocket.CONNECTING) {
            socket.close();
          } else {
            return result;
          }
        }

        const url = getUrl();
        if (!url) {
          store.dispatch({
            type: actions.wsError,
            payload: 'Не указан URL для WebSocket',
          });
          return result;
        }

        socket = new WebSocket(url);

        socket.onopen = (): void => {
          store.dispatch({ type: actions.wsOpen });
        };

        socket.onerror = (_event: Event): void => {
          store.dispatch({
            type: actions.wsError,
            payload: 'Ошибка WebSocket соединения',
          });
        };

        socket.onclose = (_event: CloseEvent): void => {
          socket = null;
          store.dispatch({ type: actions.wsClose });
        };

        socket.onmessage = (event: MessageEvent<string>): void => {
          try {
            const data = JSON.parse(event.data) as unknown;
            if (typeof data !== 'object' || data === null) {
              throw new Error('Получены некорректные данные');
            }

            const response = data as { message?: string } & TWSOrdersResponse;
            if (response.message) {
              store.dispatch({
                type: actions.wsError,
                payload: String(response.message),
              });
              socket?.close();
              return;
            }

            if (!isValidWSOrdersResponse(response)) {
              throw new Error('Получены некорректные данные о заказах');
            }

            store.dispatch({
              type: actions.wsMessage,
              payload: {
                orders: response.orders,
                total: response.total,
                totalToday: response.totalToday,
              },
            });
          } catch (error) {
            const message =
              error instanceof Error
                ? error.message
                : 'Ошибка обработки сообщения WebSocket';
            store.dispatch({ type: actions.wsError, payload: message });
          }
        };
      }

      if (typedAction.type === actions.wsDisconnect) {
        if (socket) {
          if (socket.readyState === WebSocket.OPEN) {
            socket.close();
          }
          socket = null;
        }
      }

      return result;
    };
};

export const ordersFeedSocketMiddleware = createWebSocketMiddleware({
  actions: {
    wsConnect: 'ordersFeed/wsConnect',
    wsDisconnect: 'ordersFeed/wsDisconnect',
    wsOpen: 'ordersFeed/wsOpen',
    wsClose: 'ordersFeed/wsClose',
    wsError: 'ordersFeed/wsError',
    wsMessage: 'ordersFeed/ordersReceived',
  },
  getUrl: () => 'wss://new-stellarburgers.education-services.ru/orders/all',
});

export const profileOrdersSocketMiddleware = createWebSocketMiddleware({
  actions: {
    wsConnect: 'profileOrders/wsConnect',
    wsDisconnect: 'profileOrders/wsDisconnect',
    wsOpen: 'profileOrders/wsOpen',
    wsClose: 'profileOrders/wsClose',
    wsError: 'profileOrders/wsError',
    wsMessage: 'profileOrders/ordersReceived',
  },
  getUrl: () => {
    const token = getRawAccessToken();
    if (!token) return '';
    return `wss://new-stellarburgers.education-services.ru/orders?token=${token}`;
  },
});
