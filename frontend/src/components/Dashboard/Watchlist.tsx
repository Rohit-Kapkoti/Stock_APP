import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { removeFromWatchlist } from '../../api/api';
import DeleteIcon from '@mui/icons-material/Delete';

const Watchlist: React.FC<{ stocks: any[] }> = ({ stocks }) => {
    const calculateChange = (open: string, close: string) => {
        const openPrice = parseFloat(open);
        const closePrice = parseFloat(close);
        const change = closePrice - openPrice;
        return change.toFixed(3);
    };

    const handleRemoveFromWatchlist = (symbol: string) => {
        removeFromWatchlist(symbol)
    };

    return (
        <div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Symbol</TableCell>
                            <TableCell>Open</TableCell>
                            <TableCell>Close</TableCell>
                            <TableCell>Change</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stocks.map(stock => (
                            <TableRow key={stock.symbol}>
                                <TableCell>{stock.symbol}</TableCell>
                                <TableCell>{stock.data['1. open']}</TableCell>
                                <TableCell>{stock.data['4. close']}</TableCell>
                                <TableCell>{calculateChange(stock.data['1. open'], stock.data['4. close'])}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleRemoveFromWatchlist(stock.symbol)} style={{
                                        color: '#e1f5fe'
                                    }}><DeleteIcon /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Watchlist;
