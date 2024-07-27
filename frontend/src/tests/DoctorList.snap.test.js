// DoctorList.snap.test.js

import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import DoctorList from '../components/DoctorList';
import { BrowserRouter } from 'react-router-dom';

// Mock Redux store
const mockStore = configureMockStore();
const store = mockStore({
  user: {
    user: {
      role: "admin",
    },
  },
});

// Suppress console.error during tests
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

// Restore console.error after tests
afterAll(() => {
  console.error.mockRestore();
});

// Mock doctor data
const doctor = {
  firstName: "John",
  lastName: "Doe",
  specialization: "Cardiology",
  experience: "10 years",
  feesPerConsultation: "$100",
  starttime: "09:00 AM",
  endtime: "05:00 PM",
  status: "pending",
};

// Mock handleAccountStatus function
const handleAccountStatus = jest.fn();

// Snapshot test for DoctorList component
it('renders DoctorList component correctly', () => {
  const tree = renderer.create(
    <Provider store={store}>
      <BrowserRouter>
        <DoctorList doctor={doctor} handleAccountStatus={handleAccountStatus} />
      </BrowserRouter>
    </Provider>
  ).toJSON();
  expect(tree).toMatchSnapshot(); // Compare rendered component to the snapshot
});
















