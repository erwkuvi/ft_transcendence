const Filter = (props) => {
	return (
	  <div>
		<input  className = {props.className}
				placeholder={props.placeholder}
				type={props.type}
				value={props.value}
				onChange={props.onChange}/>
	  </div>
	)
}

export default Filter;
