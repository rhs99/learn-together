import axios from 'axios';
import { FormEvent, useState, useContext } from 'react';
import Util from '../../utils';
import AuthContext from '../../store/auth';

const AddPaymentMethod = () => {
  const [newPaymentMethod, setNewPaymentMethod] = useState('');

  const authCtx = useContext(AuthContext);

  const handleAddPaymentMethod = async (event: FormEvent) => {
    event.preventDefault();
    const url = `${Util.CONSTANTS.SERVER_URL}/paymentMethods`;
    const payload = {
      name: newPaymentMethod,
    };
    await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${authCtx.getStoredValue().token}`,
        'Content-Type': 'application/json',
      },
    });
    setNewPaymentMethod('');
  };

  return (
    <form onSubmit={handleAddPaymentMethod}>
      <label htmlFor="add-payment-method">Payment Method Name</label>
      <input
        type="text"
        name="addPaymentMethod"
        value={newPaymentMethod}
        onChange={(event) => setNewPaymentMethod(event.target.value)}
        required
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default AddPaymentMethod;
