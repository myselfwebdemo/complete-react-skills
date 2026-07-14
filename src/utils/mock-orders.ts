export type TOrderIngredient = {
  _id: string;
  name: string;
  price: number;
  count: number;
};

export type TOrder = {
  _id: string;
  number: number;
  name: string;
  status: 'done' | 'pending' | 'created';
  ingredients: TOrderIngredient[];
  total: number;
  createdAt: string;
};

const orderIngredients = [
  {
    _id: 'bun-1',
    name: 'Флюоресцентная булка R2-D3',
    price: 20,
    count: 2,
  },
  {
    _id: 'main-1',
    name: 'Филе Люминесцентного тетраодонтиморфа',
    price: 300,
    count: 1,
  },
  {
    _id: 'sauce-1',
    name: 'Соус традиционный галактический',
    price: 30,
    count: 1,
  },
  {
    _id: 'veggies-1',
    name: 'Плоды фалленианского дерева',
    price: 80,
    count: 1,
  },
];

export const orders: TOrder[] = [
  {
    _id: '034535',
    number: 34535,
    name: 'Death Star Starship Main бургер',
    status: 'done',
    ingredients: orderIngredients,
    total: 480,
    createdAt: '2026-07-14T16:20:00.000Z',
  },
  {
    _id: '034534',
    number: 34534,
    name: 'Interstellar бургер',
    status: 'pending',
    ingredients: orderIngredients,
    total: 560,
    createdAt: '2026-07-14T13:20:00.000Z',
  },
  {
    _id: '034533',
    number: 34533,
    name: 'Black Hole Singularity острый бургер',
    status: 'done',
    ingredients: orderIngredients,
    total: 510,
    createdAt: '2026-07-13T13:50:00.000Z',
  },
  {
    _id: '034532',
    number: 34532,
    name: 'Supernova Infinity бургер',
    status: 'created',
    ingredients: orderIngredients,
    total: 620,
    createdAt: '2026-07-12T21:53:00.000Z',
  },
];

export const getOrderById = (id: string): TOrder | undefined =>
  orders.find((order) => order._id === id || String(order.number) === id);
