import { Link } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';

export default function ListingsTable({rows, type}) {
    console.log(rows)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
    const lengthRows = rows?.length - 1
    const columns = type === 'listing' ? [
        { id: 'Contact_Name', label: 'Name'},
        { id: 'Contact_Number', label: 'Number'},
        { id: 'Email', label: 'Email'},
        { id: 'Make', label: 'Make'},
        { id: 'Model_Name', label: 'Model_Name'},
        { id: 'Model_Year', label: 'Model Year'},
        { id: 'Price', label: 'Price'},
        { id: 'Mileage', label: 'Mileage'}
      ] : [
        { id: 'Name', label: 'Name'},
        { id: 'Contact_Number', label: 'Number'},
        { id: 'Email', label: 'Email'},
        { id: 'Vehicle', label: 'Vehicle'},
        { id: 'Model_Year', label: 'Model Year'},
        { id: 'Mileage', label: 'Mileage'}
      ];
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
  
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell>
                  Edit
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {value}
                          </TableCell>
                        );
                      })}
                      <TableCell><Link sx={{paddingRight: 2}} href={`/edit/user/${row._id}`}>Edit</Link></TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    );
  }