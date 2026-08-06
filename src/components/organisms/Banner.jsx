import { useEffect, useState } from "react";
import banners from "../../data/banners";
import "../../css/Banner.css";

function Banner(){

const [current,setCurrent]=useState(0);

useEffect(()=>{

const interval=setInterval(()=>{
setCurrent(prev=>(prev+1)%banners.length);
},4000);

return()=>clearInterval(interval);

},[]);


function next(){
setCurrent((current+1)%banners.length);
}

function previous(){
setCurrent((current-1+banners.length)%banners.length);
}


return(
<section className="banner-slider">

<div 
className="banner-track"
style={{
transform:`translateX(-${current*100}%)`
}}
>

{
banners.map(banner=>(

<div 
className="banner-slide"
key={banner.id}
>

<img
src={banner.image}
alt={banner.title}
/>

<div className="banner-text">

<h1>{banner.title}</h1>

<p>{banner.text}</p>

<button>
Ver productos
</button>

</div>

</div>

))
}

</div>


<button 
className="banner-btn left"
onClick={previous}
>
❮
</button>


<button 
className="banner-btn right"
onClick={next}
>
❯
</button>


<div className="dots">

{
banners.map((_,index)=>(

<span
key={index}
className={index===current?"active":""}
onClick={()=>setCurrent(index)}
></span>

))
}

</div>


</section>
);

}

export default Banner;