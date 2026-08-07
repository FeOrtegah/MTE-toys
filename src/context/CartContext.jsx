import { createContext,useContext,useState } from "react";

const CartContext=createContext();

export function CartProvider({children}){

const [cart,setCart]=useState([]);


function addToCart(product){

const exist=cart.find(
(item)=>item.id===product.id
);


if(exist){

setCart(
cart.map(item=>
item.id===product.id
?
{...item,quantity:item.quantity+1}
:
item
)
);

}else{

setCart([
...cart,
{
...product,
quantity:1
}
]);

}

}


function removeFromCart(id){

setCart(
cart.filter(item=>item.id!==id)
);

}


function increase(id){

setCart(
cart.map(item=>
item.id===id
?
{...item,quantity:item.quantity+1}
:
item
)
);

}


function decrease(id){

setCart(
cart.map(item=>
item.id===id && item.quantity>1
?
{...item,quantity:item.quantity-1}
:
item
)
);

}


function total(){

return cart.reduce(
(sum,item)=>
sum+(item.price*item.quantity),
0
);

}


function clearCart(){

setCart([]);

}


return(
<CartContext.Provider
value={{
cart,
addToCart,
removeFromCart,
increase,
decrease,
total,
clearCart
}}
>
{children}
</CartContext.Provider>
);

}


export function useCart(){

return useContext(CartContext);

}