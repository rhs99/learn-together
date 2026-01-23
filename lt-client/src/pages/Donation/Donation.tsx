import { useNavigate } from 'react-router-dom';
import { ChangeEvent, FormEvent, useState, useContext, useEffect } from 'react';
import axios from 'axios';

import Util from '../../utils';
import AuthContext from '../../store/auth';
import { DonationInfo } from '../../types';
import { RadioGroup, Radio, Input, DateInput, Field, Button, Box, Heading } from '@optiaxiom/react';

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
    <Box display="flex" justifyContent="center" alignItems="center" mt="40">
      <Box
        data-donation-container
        w="1/4"
        p="32"
        bg="bg.default"
        rounded="lg"
        shadow="lg"
        border="1"
        borderColor="border.default"
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <Box
          style={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'var(--gradient-primary)',
          }}
        />
        <Heading level="1" fontSize="2xl" textAlign="center" mb="24">
          Make a Donation
        </Heading>
        <Box asChild>
          <form onSubmit={handleDonation}>
            <Field label="Date of Donation" required>
              <DateInput value={donationDate} onValueChange={setDonationDate} required />
            </Field>

            <Field label="Amount" required>
              <Input
                type="number"
                appearance="number"
                value={amount === 0 ? '' : amount.toString()}
                onValueChange={(value) => setAmount(Number(value))}
                required
              />
            </Field>

            <Field label="Select your Payment Method">
              <RadioGroup value={method} onChange={onValueChange}>
                {availableMethods.map((option) => (
                  <Radio key={option._id} value={option.name}>
                    {option.name}
                  </Radio>
                ))}
              </RadioGroup>
            </Field>

            <Field label="Transaction ID" required>
              <Input value={transactionID} onValueChange={setTransactionID} required />
            </Field>

            <Field label="Contact Information (optional)">
              <Input value={contactInfo} onValueChange={setContactInfo} />
            </Field>

            <Button type="submit" w="full" justifyContent="center">
              Make Donation
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default DonationPage;
