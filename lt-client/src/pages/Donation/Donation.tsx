import { useNavigate } from 'react-router-dom';
import { ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';

import Util from '../../utils';

import './_index.scss';

const DonationPage = () => {
  const [donationDate, setDonationDate] = useState('');
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState('');
  const [transactionID, setTransactionID] = useState('');
  const [accountNo, setAccountNo] = useState(0);
  const [contactNo, setContactNo] = useState(0);
  const [furtherInfo, setFurtherInfo] = useState('');
  const [err, setErr] = useState('');

  const navigate = useNavigate();

  const onValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMethod(event.target.value);
  };

  const handleDonation = async (event: FormEvent) => {
    event.preventDefault();

    const URL = Util.CONSTANTS.SERVER_URL + '/gg';

    const donationInfo: { [key: string]: any } = {
      userName: localStorage.getItem('userName'),
      amount: amount,
      date: donationDate,
      method: method,
      transactionID: transactionID,
      accountNo: accountNo,
      contactNo: contactNo,
      furtherInfo: furtherInfo,
    };

    console.log(donationInfo);
    navigate('/');

    // axios
    //   .post(URL, donationInfo)
    //   .then(() => {
    //     navigate('/');
    //   })
    //   .catch((err) => {
    //     setErr(err.response.data.message);
    //   });
  };

  return (
    <div className="cl-Donation">
      <div className="donation-form-container">
        <p className="header">Fill up your Donation Info</p>
        <form onSubmit={handleDonation}>
          <label htmlFor="donationDate">Date of Donation</label>
          <input
            type="date"
            name="donationDate"
            value={donationDate}
            onChange={(event) => setDonationDate(event.target.value)}
            required
          />
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            name="amount"
            min={0}
            value={amount === 0 ? '' : amount}
            onChange={(event) => setAmount(Number(event.target.value))}
            required
          />
          <label>Select your Payment Method</label>
          <label>
            <input type="radio" value="bKash" checked={method === 'bKash'} onChange={onValueChange} />
            bKash
          </label>
          <label>
            <input type="radio" value="Nagad" checked={method === 'Nagad'} onChange={onValueChange} />
            Nagad
          </label>
          <label>
            <input type="radio" value="Rocket" checked={method === 'Rocket'} onChange={onValueChange} />
            Rocket
          </label>
          <label htmlFor="transactionID">Transaction ID</label>
          <input
            type="text"
            name="transactionID"
            value={transactionID}
            onChange={(event) => setTransactionID(event.target.value)}
            required
          />
          <label htmlFor="accountNo">Account Number</label>
          <input
            type="number"
            name="accountNo"
            min={0}
            value={accountNo === 0 ? '' : accountNo}
            onChange={(event) => setAccountNo(Number(event.target.value))}
            required
          />
          <label htmlFor="contactNo">Contact Number(optional)</label>
          <input
            type="number"
            name="contactNo"
            min={0}
            value={contactNo === 0 ? '' : contactNo}
            onChange={(event) => setContactNo(Number(event.target.value))}
          />
          <label htmlFor="furtherInfo">Further Info(optional)</label>
          <input
            type="text"
            name="furtherInfo"
            value={furtherInfo}
            onChange={(event) => setFurtherInfo(event.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      {err && <div className="err">{err}</div>}
    </div>
  );
};

export default DonationPage;
