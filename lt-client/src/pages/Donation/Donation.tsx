import { useNavigate } from 'react-router-dom';
import { ChangeEvent, FormEvent, useState, useContext, useEffect } from 'react';
import axios from 'axios';

import { Switch } from '@optiaxiom/react';
import Util from '../../utils';
import AuthContext from '../../store/auth';

import './_index.scss';

type PaymentMethod = {
  _id: string;
  name: string;
};

const DonationPage = () => {
  const [donationDate, setDonationDate] = useState('');
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState('');
  const [transactionID, setTransactionID] = useState('');
  const [contactNo, setContactNo] = useState(0);
  const [furtherInfo, setFurtherInfo] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [availableMethods, setAvailableMethods] = useState<PaymentMethod[]>([]);

  const { getStoredValue } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${Util.CONSTANTS.SERVER_URL}/paymentMethods`).then((res) => {
      setAvailableMethods(res.data);
    });
  }, []);

  const onValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMethod(event.target.value);
  };

  const handleDonation = async (event: FormEvent) => {
    event.preventDefault();

    const URL = Util.CONSTANTS.SERVER_URL + '/donations';

    let selectedMethod = '';
    availableMethods.forEach((currMethod) => {
      if (currMethod.name === method) {
        selectedMethod = currMethod._id;
      }
    });

    const donationInfo: { [key: string]: any } = {
      donor: getStoredValue().userName,
      amount: amount,
      dateOfDonation: donationDate,
      method: selectedMethod,
      transactionID: transactionID,
      contactNo: contactNo,
      furtherInfo: furtherInfo,
    };

    axios.post(URL, donationInfo).then((_res) => {
      navigate('/');
    });
  };

  return (
    <div className="cl-Donation">
      <div className="donation-form-container">
        <p className="header">Fill up your Donation Info</p>
        <div className="anonymous">
          <label>Anonymous donation</label>
          <Switch onChange={() => setIsAnonymous(!isAnonymous)} />
        </div>
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
          {availableMethods.map((option) => {
            return (
              <label key={option.name}>
                <input type="radio" value={option.name} checked={method === option.name} onChange={onValueChange} />
                {option.name}
              </label>
            );
          })}
          <label htmlFor="transactionID">Transaction ID</label>
          <input
            type="text"
            name="transactionID"
            value={transactionID}
            onChange={(event) => setTransactionID(event.target.value)}
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
          <div></div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default DonationPage;
