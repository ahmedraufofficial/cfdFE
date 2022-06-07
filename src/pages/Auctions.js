import { Grid, Stack } from '@mui/material';
import { React } from 'react';
import AuctionCard from '../components/AuctionCard';
import { paperStyle } from '../styles';

function Auctions(props) {
    const auctions = props.auctions 
    return (
        <Grid style={paperStyle}>
        <Grid>
            <h2>Auctions</h2>
        </Grid>
            {auctions.length > 0 && (
                auctions.map(auction => 
                    <Stack mt={3}>
                        <AuctionCard data={auction} key={auction._id} />
                    </Stack>
                ).reverse()
            )}
        </Grid>
    )
}

export default Auctions