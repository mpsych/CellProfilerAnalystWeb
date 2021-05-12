import React from 'react';
import {
	makeStyles,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
} from '@material-ui/core';

const columns = [
	{ id: 'imageNumber', label: 'Image Number', width: 20 },

	{
		id: 'total',
		label: 'Total',
		width: 20,
		align: 'right',
	},
	{
		id: 'positive',
		label: 'Positive\u00a0',
		width: 40,
		align: 'right',
		format: (value) => value.toLocaleString('en-US'),
	},
	{
		id: 'negative',
		label: 'Negative\u00a0',
		width: 40,
		align: 'right',
		
	},
	{
		id: 'ratio',
		label: 'Ratio\u00a0',
		width: 40,
		align: 'right',
		format: (value) => value.toFixed(3),
	},
	{
		id: 'adjustratio',
		label: 'Adjusted Ratio\u00a0',
		width: 40,
		align: 'right',
		format: (value) => value.toFixed(3),
	},
];

//fake data
function createData(imageNumber, total, positive) {
	const ratio = '50%';
	const adjustratio = '90%';
	const negative = total - positive;
	return { imageNumber, total, positive, negative, ratio, adjustratio };
}

// const rows = [
// 	createData('1', '', 1324171354, 3287263),
// 	createData('2', '', 1403500365, 9596961),
// 	createData('3', '', 60483973, 301340),
// 	createData('4', '', 327167434, 9833520),
// 	createData('5', '', 37602103, 9984670),
// 	createData('6', '', 25475400, 7692024),
// 	createData('7', '', 83019200, 357578),
// 	createData('8', '', 4857000, 70273),
// 	createData('9', '', 126577691, 1972550),
// 	createData('10', '', 126317000, 377973),
// 	createData('11', '', 67022000, 640679),
// 	createData('12', '', 67545757, 242495),
// 	createData('13', '', 146793744, 17098246),
// 	createData('14', '', 200962417, 923768),
// 	createData('15', '', 210147125, 8515767),
// ];

export default function ScoreTableUI(props) {
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};



	return (
		<Paper>
			<TableContainer
			// style = {{height: 700, width: 700}}
			>
				<Table size="small" stickyHeader aria-label="sticky table" style={{ width: 200, marginTop: 45 }}>
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>

					<TableBody>
						{props.scoreTable? props.scoreTable.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
							return (
								<TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
									{columns.map((column) => {
										const value = row[column.id];
										return (
											<TableCell key={column.id} align={column.align}>
												{column.format && typeof value === 'number'
													? column.format(value)
													: value}
											</TableCell>
										);
									}) }
								</TableRow>
							);
						}) : null}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
}
