const squareStyle = {
    width: '100%',
    height: '100%',
};
export const Square = ({ black, children }) => {
    //when a item is being dragged, highlights white
    // if black piece
    //black if white piece
    const backgroundColor = black ? 'white' : 'black';
    const color = black ? 'white' : 'blue';
    return (<div style={{
        ...squareStyle,
        color,
        backgroundColor,
    }}>
			{children}
		</div>);
};
