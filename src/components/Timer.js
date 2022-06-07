import { useEffect, useState } from 'react';

const calcTimeLeft = t => {
  if (!t) return 0;

  const left = t - new Date().getTime();

  if (left < 0) return 0;

  return left;
};

export default function Timer(endTime, auction) {
  const [end, setEndTime] = useState(endTime);
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(end));

  const createNegotiation = async () => {
    const values = {
      Auction_Id: auction?._id,
      Auction_Type: auction?.Auction_Type,
      Product_Description: auction?.Product_Description,
      Currency: auction?.Currency,
      Current_Bid: auction?.Current_Bid,
      Negotiation_Duration: auction?.Negotiation_Duration,
      Negotiation_Mode: auction?.Negotiation_Mode,
      Set_Incremental_Price: auction?.Set_Incremental_Price,
      Vehicle_Title: auction?.Vehicle_Title,
      Status: auction?.Status,
      Bids: auction?.Bids
    }
    if (auction?.Negotiation_Mode === "automatic") {
      values.Buy_Now_Price = auction?.Current_Bid;
      values.Negotiation_Start_Date = new Date();
    }
    const createNegotiation = await fetch(`${process.env.REACT_APP_API}/add/negotiation`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(values)
    });

    const data = await createNegotiation.json();
    if (data.status === "200") {
      await fetch(`${process.env.REACT_APP_API}/edit/auction/${auction?._id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          Current_Bid: (auction?.Current_Bid).toString(),
          Status: "Negotiation"
        })
    });
    }
  };

  useEffect(() => {
    setTimeLeft(calcTimeLeft(end));

    const timer = setInterval(() => {
      const targetLeft = calcTimeLeft(end);
      setTimeLeft(targetLeft);

      if (targetLeft === 0) {
        createNegotiation();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [end]);

  return [timeLeft, setEndTime];
}
