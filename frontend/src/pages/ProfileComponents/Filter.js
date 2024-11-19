const Filter = (props) => {
	return (
	  <div>
		<input  type={props.type}
				value={props.value}
				onChange={props.onChange}/>
	  </div>
	)
}

export default Filter;
