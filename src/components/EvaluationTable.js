import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import * as React from 'react';
import CustomModal from './CustomModal';
import { Link } from '@mui/material';

export default function EvaluationTable({rows, auctionId, section}) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    console.log(rows)
    const lengthRows = rows?.length - 1
    const columns = [
        { id: 'Appointment_Date', label: 'Appointment Date'},
        { id: 'Time', label: 'Time'},
        { id: 'Car_Valuation_Details.Make', label: 'Make'},
        { id: 'Car_Valuation_Details.Model_Name', label: 'Model'},
        { id: 'Car_Valuation_Details.Model_Year', label: 'Model_Year'},
        { id: 'Customer_Information.Contact_Name', label: 'Customer'},
        { id: 'Location', label: 'Branch'},
        { id: 'User', label: 'Salesman'},
        { id: 'Valuation_Status', label: 'Status'},
        { id: 'Sell_Option', label: 'Option'},
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
                {
                  section == 'Evaluations' ? <TableCell>Edit</TableCell> : <></>
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                      {columns.map((column) => {
                        let value = ""
                        let seperator = column.id.split(".")
                        if (seperator.length > 1) { 
                          value = row[seperator[0]][seperator[1]]
                        } else {
                          value = row[column.id];
                        }
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}

                      {
                      section == 'Evaluations' ? <TableCell>{index == lengthRows ? <Link href={`/evaluation/edit/${row._id}`}>Link</Link>:<></>}</TableCell> : <></>
                      }
                      {
                      section == 'Evaluations' ? <TableCell>{index == lengthRows ? <Link href={`/evaluation/edit/${row._id}`}>Appoint</Link>:<></>}</TableCell> : <></>
                      }
                      {
                      section == 'Appointments' ? <TableCell>{index == lengthRows ? <Link href={`/evaluation/edit/${row._id}`}>Inspect</Link>:<></>}</TableCell> : <></>
                      }
                      {
                      section == 'Inspections' ? <TableCell>{index == lengthRows ? <Link href={`/evaluation/edit/${row._id}`}>Auction</Link>:<></>}</TableCell> : <></>
                      }
                      {
                      section == 'Auctions' ? <TableCell>{index == lengthRows ? <Link href={`/evaluation/edit/${row._id}`}>Done</Link>:<></>}</TableCell> : <></>
                      }

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