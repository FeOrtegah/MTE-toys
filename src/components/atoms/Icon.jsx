function Icon({type}) {

const icons = {

truck:
<path d="M0 80h50V20h80l40 40h60v80h-40a30 30 0 1 1-60 0H80a30 30 0 1 1-60 0H0z"/>,


gift:
<path d="M20 50h160v120H20zM100 50v120M20 80h160M100 50c-40-50-70 0 0 0M100 50c40-50 70 0 0 0"/>,


card:
<path d="M20 40h160v120H20zM20 80h160"/>,


star:
<path d="M100 10l25 60 65 5-50 40 15 65-55-35-55 35 15-65-50-40 65-5z"/>

};


return (

<svg 
className="icon"
viewBox="0 0 200 200"
>
{icons[type]}
</svg>

);

}

export default Icon;