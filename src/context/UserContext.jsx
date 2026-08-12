import { createContext, useContext, useState } from "react";

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

setUser(null);

localStorage.removeItem("user");
localStorage.removeItem("token");

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