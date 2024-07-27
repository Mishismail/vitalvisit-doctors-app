// getAppointments.unit.test.js

import { getAppointments } from '../pages/Appointments';
import axios from 'axios';

jest.mock('axios');

// Suppress console.error during tests
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

// Restore console.error after tests
afterAll(() => {
  console.error.mockRestore();
});

describe('getAppointments', () => {
  // Test successful fetching of appointments
  it('fetches appointments successfully', async () => {
    const data = {
      data: {
        success: true,
        data: [{ _id: '1', date: '2024-07-20', time: '10:00' }],
      },
    };
    axios.get.mockResolvedValue(data);

    const setAppointments = jest.fn();
    await getAppointments(setAppointments);

    expect(axios.get).toHaveBeenCalledWith('/api/user/user-appointments', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    expect(setAppointments).toHaveBeenCalledWith(data.data.data);
  });

  // Test handling of errors during fetching of appointments
  it('handles errors', async () => {
    const errorMessage = 'Network Error';
    axios.get.mockRejectedValue(new Error(errorMessage));

    const setAppointments = jest.fn();
    await getAppointments(setAppointments);

    expect(axios.get).toHaveBeenCalledWith('/api/user/user-appointments', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    // Add more assertions as needed to verify error handling
  });
});
