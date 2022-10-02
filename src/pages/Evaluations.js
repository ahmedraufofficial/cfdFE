import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { EvaluationBar } from '../components/EvaluationBar';
import { paperStyle } from '../styles';

export default function Evaluations() {
    const [evaluations, setEvaluations] = useState([]);

    const fetchevaluations = () => {
        fetch(`${process.env.REACT_APP_API}/evaluations`)
          .then(response => {
            return response.json()
          })
          .then(data => {
            setEvaluations(data.data)
          })
    }

    useEffect(()=>{
        fetchevaluations();
    },[])


  return (
    <Grid style={paperStyle}>
      Evaluations
        {evaluations?.length > 0 && (
            evaluations?.map((evaluation, index) => {
                return <EvaluationBar key={index} data={evaluation} />
            })
        )}
    </Grid>
  )
}
