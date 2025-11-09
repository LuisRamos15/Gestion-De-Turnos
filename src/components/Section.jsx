export default function Section({title, subtitle, children, titleClass = "", subtitleClass = ""}){

return (

<div className="stack">

<div>

<h2 className={`title ${titleClass}`}>{title}</h2>

{subtitle && <div className={`subtitle ${subtitleClass}`}>{subtitle}</div>}

</div>

{children}

</div>

)

}