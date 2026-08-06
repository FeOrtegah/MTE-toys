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


function logout(){

setUser(null);

localStorage.removeItem("user");

}


return(
<UserContext.Provider
value={{
user,
login,
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