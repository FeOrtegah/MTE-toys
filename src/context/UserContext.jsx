import { createContext, useContext, useState } from "react";
import { logout as logoutRequest } from "../services/authService";

const UserContext = createContext();

export function UserProvider({children}){

const [user,setUser]=useState(
JSON.parse(localStorage.getItem("user")) || null
);


function login(data){

setUser(data);

localStorage.setItem(
"user",
JSON.stringify(data)
);

}


function updateUser(partial){

setUser(prev=>{
const actualizado = { ...prev, ...partial };
localStorage.setItem("user", JSON.stringify(actualizado));
return actualizado;
});

}


function logout(){

// La cookie de sesión es httpOnly: el frontend no puede
// leerla ni borrarla directamente, por eso hay que avisarle
// al backend para que la elimine. No se espera (await) para
// no trabar la salida del usuario si la red falla.
logoutRequest().catch(() => {});

setUser(null);

localStorage.removeItem("user");

}


return(
<UserContext.Provider
value={{
user,
login,
updateUser,
logout
}}
>
{children}
</UserContext.Provider>
);

}


export function useUser(){

return useContext(UserContext);

}