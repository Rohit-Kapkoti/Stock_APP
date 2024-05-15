import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Box, Container } from '@mui/material';
import { getWatchlistStockData, addToWatchlist } from '../../api/api';
import Watchlist from './Watchlist';

const Dashboard: React.FC = () => {
    const [stocks, setStocks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [symbolInput, setSymbolInput] = useState('');

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const response = await getWatchlistStockData();
                setStocks(response.data);
            } catch (error) {
                console.error('Failed to fetch stock data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStockData();
    }, []);

    const handleAddToWatchlist = async () => {
        try {
            await addToWatchlist(symbolInput);
            setSymbolInput('');
            const response = await getWatchlistStockData();
            setStocks(response.data);
        } catch (error) {
            console.error('Failed to add symbol to watchlist:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            padding: 0
        }} >
            <Box bgcolor={"#e1f5fe"} padding={1} borderRadius={1}>
                <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                    Dashboard
                </Typography>
            </Box>
            <Container style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
            }}>
                <Container style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: ".5rem"
                }}>
                    <TextField
                        id="outlined-size-small"
                        defaultValue="Small"
                        size="small"
                        label="Enter symbol"
                        value={symbolInput}
                        onChange={(e) => setSymbolInput(e.target.value)}
                    />
                    <Button variant="contained" onClick={handleAddToWatchlist}>Add to Watchlist</Button>
                </Container>
                <Watchlist stocks={stocks} />
            </Container>
        </Container>
    );
};

export default Dashboard;
