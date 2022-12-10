import { Grid } from '@mui/material';
import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EvaluationCard from '../components/EvaluationCard';
import { paperStyle } from '../styles';

export default function Evaluations() {
    const navigate = useNavigate();
    const [evaluations, setEvaluations] = useState([])

    const fetchData = () => {
        fetch(`${process.env.REACT_APP_API}/evaluations`)
          .then(response => {
            return response.json()
          })
          .then(data => {
            setEvaluations(data.data)
          })
      }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <Grid style={paperStyle}>
                <Grid>
                    <h2>Evaluations</h2>
                </Grid>
                <Grid container spacing={24}>
                    {evaluations.length > 0 && (
                        evaluations.map((evaluation) => (
                            <Grid item>
                                <EvaluationCard data={evaluation} key={evaluation._id} />
                            </Grid>
                        ))
                    )}

                </Grid>
        </Grid>
    )
}
