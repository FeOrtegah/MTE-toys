const giftsByPrice = [
  {
    id: 1,
    title: "Regalos por menos de $10.000",
    image: "/regalos/regalo10.png",
    link: "/productos?max=10000"
  },
  {
    id: 2,
    title: "Regalos por menos de $20.000",
    image: "/regalos/regalo20.png",
    link: "/productos?max=20000"
  },
  {
    id: 3,
    title: "Regalos por menos de $30.000",
    image: "/regalos/regalo30.png",
    link: "/productos?max=30000"
  },
  {
    id: 4,
    title: "Regalos Premium",
    image: "/regalos/regalo40.png",
    link: "/productos?min=30000"  // Muestra productos desde $30.000 en adelante
  }
];

export default giftsByPrice;