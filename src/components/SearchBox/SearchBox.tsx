import css from "./SearchBox.module.css";
interface SearchBoxProps{
  onSearch: (search:string)=>void
}
export default function SearchBox({onSearch}:SearchBoxProps) {


  return <input className={css.input} type="text" placeholder="Search posts" onChange={event=>onSearch(event.target.value)}/>;
}
