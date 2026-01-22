import axios from 'axios';
import { FormEvent, useState, useContext } from 'react';
import Util from '../../utils';
import { HttpError } from '../../types';
import AuthContext from '../../store/auth';
import { Box, Heading, Field, Input, Button } from '@optiaxiom/react';

const AddPaymentMethod = () => {
  const [newPaymentMethod, setNewPaymentMethod] = useState('');
  const [err, setErr] = useState('');

  const authCtx = useContext(AuthContext);

  const handleAddPaymentMethod = async (event: FormEvent) => {
    event.preventDefault();
    const url = `${Util.CONSTANTS.SERVER_URL}/paymentMethods`;
    const payload = {
      name: newPaymentMethod,
    };

    try {
      await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${authCtx.getStoredValue().token}`,
          'Content-Type': 'application/json',
        },
      });
      setNewPaymentMethod('');
      setErr('');
    } catch (error: unknown) {
      const httpError = error as HttpError;
      setErr(httpError.response?.data?.message || 'Failed to add payment method');
    }
  };

  return (
    <Box className="settings-form-container">
      <Heading level="2" fontSize="xl" mb="24">
        Add Payment Method
      </Heading>
      <Box asChild>
        <form onSubmit={handleAddPaymentMethod}>
          <Field label="Payment Method Name" required error={err || undefined}>
            <Input value={newPaymentMethod} onValueChange={setNewPaymentMethod} required />
          </Field>

          <Button type="submit" w="full" justifyContent="center">
            Add
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default AddPaymentMethod;
