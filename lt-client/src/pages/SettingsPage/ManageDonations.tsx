import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Util from '../../utils';
import AuthContext from '../../store/auth';
import { Flex, Text, Button, Table, TableHeader, TableRow, TableCell, TableBody } from '@optiaxiom/react';

type Donation = {
  _id: string;
  amount: number;
  dateOfDonation: string;
  method: {
    _id: string;
    name: string;
  };
  transactionID: string;
  contactInfo?: string;
  status: 'pending' | 'completed';
};

const ManageDonations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const { getStoredValue } = useContext(AuthContext);

  const fetchDonations = async () => {
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const token = getStoredValue().token;
      const { data } = await axios.get(`${Util.CONSTANTS.SERVER_URL}/donations`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDonations(data);
    } catch (error) {
      console.error('Error fetching donations:', error);
      setMessage({ 
        text: 'Failed to load donations. Please try again.', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleApprove = async (id: string) => {
    setMessage({ text: '', type: '' });
    try {
      if (!id) {
        throw new Error('Donation ID is missing');
      }
      
      console.log(`Approving donation with ID: ${id}`);
      const token = getStoredValue().token;
      
      if (!token) {
        throw new Error('Authentication token is missing');
      }
      
      const response = await axios.put(
        `${Util.CONSTANTS.SERVER_URL}/donations/${id}/approve`, 
        {}, // Empty body as we're just changing status
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('Approval response:', response.data);
      
      // Update the local state to reflect the change
      setDonations(prevDonations => 
        prevDonations.map(donation => 
          donation._id === id ? { ...donation, status: 'completed' } : donation
        )
      );
      setMessage({ 
        text: 'Donation approved successfully!', 
        type: 'success' 
      });
    } catch (error: any) {
      console.error('Error approving donation:', error);
      
      // Extract the most specific error message possible
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to approve donation';
                          
      console.error('Error details:', errorMessage);
      
      setMessage({ 
        text: `Failed to approve donation: ${errorMessage}`, 
        type: 'error' 
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="manage-donations">
      <Flex flexDirection="column" gap="16">
        <Flex justifyContent="space-between" alignItems="center">
          <h3>Manage Donations</h3>
          <Button onClick={fetchDonations} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </Flex>
        
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        {donations.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((donation) => (
                <TableRow key={donation._id}>
                  <TableCell>${donation.amount}</TableCell>
                  <TableCell>{formatDate(donation.dateOfDonation)}</TableCell>
                  <TableCell>{donation.method?.name || 'N/A'}</TableCell>
                  <TableCell>{donation.transactionID}</TableCell>
                  <TableCell>
                    <span className={`status-badge ${donation.status === 'pending' ? 'status-pending' : 'status-completed'}`}>
                      {donation.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {donation.status === 'pending' && (
                      <Button onClick={() => handleApprove(donation._id)} size="sm">
                        Approve
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Text className="no-donations-text">
            {isLoading ? 'Loading donations...' : 'No donations found'}
          </Text>
        )}
      </Flex>
    </div>
  );
};

export default ManageDonations;
