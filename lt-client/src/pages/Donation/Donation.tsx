import { useNavigate } from 'react-router-dom';
import { ChangeEvent, FormEvent, useState, useContext, useEffect } from 'react';
import axios from 'axios';

import Util from '../../utils';
import AuthContext from '../../store/auth';
import { DonationInfo } from '../../types';
import { RadioGroup, Radio } from '@optiaxiom/react';

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
  const [contactInfo, setContactInfo] = useState('');
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

    const donationInfo: DonationInfo = {
      donor: getStoredValue().userName,
      amount: amount,
      dateOfDonation: donationDate,
      method: selectedMethod,
      transactionID: transactionID,
      contactInfo: contactInfo,
    };

    axios.post(URL, donationInfo).then((_res) => {
      navigate('/');
    });
  };

  return (
    <div className="cl-Donation">
      <div className="donation-form-container">
        <h1 className="header">Make a Donation</h1>
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
          <RadioGroup value={method} onChange={onValueChange} className="payment-method-radio">
            {availableMethods.map((option) => (
              <Radio key={option._id} value={option.name} className="radio-option">
                {option.name}
              </Radio>
            ))}
          </RadioGroup>

          <label htmlFor="transactionID">Transaction ID</label>
          <input
            type="text"
            name="transactionID"
            value={transactionID}
            onChange={(event) => setTransactionID(event.target.value)}
            required
          />

          <label htmlFor="contactInfo">Contact Information (optional)</label>
          <input
            type="text"
            name="contactInfo"
            min={0}
            value={contactInfo}
            onChange={(event) => setContactInfo(event.target.value)}
          />
          <button type="submit">Make Donation</button>
        </form>
      </div>
    </div>
  );
};

export default DonationPage;
