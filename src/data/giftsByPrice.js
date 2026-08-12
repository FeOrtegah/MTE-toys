const giftsByPrice = [
  {
    id: 1,
    title: "Regalos por menos de $10.000",
    image: "/regalos/regalo10.png",
    maxPrice: 10000,
    link: "/productos?maxPrice=10000"
  },
  {
    id: 2,
    title: "Regalos por menos de $20.000",
    image: "/regalos/regalo20.png",
    maxPrice: 20000,
    link: "/productos?maxPrice=20000"
  },
  {
    id: 3,
    title: "Regalos por menos de $30.000",
    image: "/regalos/regalo30.png",
    maxPrice: 30000,
    link: "/productos?maxPrice=30000"
  },
  {
    id: 4,
    title: "Regalos Premium",
    image: "/regalos/regalo40.png",
    maxPrice: null, // Sin límite o según tus categorías
    link: "/productos?category=premium"
  }
];

export default giftsByPrice;