import { Grid, Stack } from '@mui/material';
import { React } from 'react';
import NegotiationCard from '../components/NegotiationCard';
import { paperStyle } from '../styles';


function Negotiations(props) {
  const negotiations = props.negotiations
    return (
        <Grid style={paperStyle}>
        <Grid>
            <h2>Negotiations</h2>
        </Grid>
        
            {negotiations.length > 0 && (
                negotiations.map((negotiation, index) => 
                    <Stack key={index} mt={3}>
                        <NegotiationCard data={negotiation} key={negotiation._id} />
                    </Stack>
                ).reverse()
            )}
        </Grid>
    )
}

export default Negotiations