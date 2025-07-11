import axios from 'axios';
import { FormEvent, useState, useContext } from 'react';
import Util from '../../utils';
import { HttpError } from '../../types';
import AuthContext from '../../store/auth';

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
    <div className="settings-form-container">
      <h2 className="header">Add Payment Method</h2>
      <form onSubmit={handleAddPaymentMethod}>
        <label htmlFor="add-payment-method">Payment Method Name</label>
        <input
          type="text"
          name="addPaymentMethod"
          value={newPaymentMethod}
          onChange={(event) => setNewPaymentMethod(event.target.value)}
          required
        />
        {err && <span className="err">{err}</span>}
        <button type="submit" className="settings-button">
          Add
        </button>
      </form>
    </div>
  );
};

export default AddPaymentMethod;
