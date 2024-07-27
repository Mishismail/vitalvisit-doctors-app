// alertSlice.unit.test.js

import alertReducer, { 
  showLoading, 
  hideLoading, 
  setUserNotification, 
  setSeenNotification 
} from '../redux/features/alertSlice';

// Suppress console.error during tests
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

// Restore console.error after tests
afterAll(() => {
  console.error.mockRestore();
});

// Initial state for the alert slice
const initialState = {
  loading: false,
  user: {
    notification: [],
    seennotification: [],
  },
};

describe('alertSlice reducer', () => {
  // Test initial state
  it('should handle initial state', () => {
    expect(alertReducer(undefined, {})).toEqual(initialState);
  });

  // Test showLoading action
  it('should handle showLoading', () => {
    expect(alertReducer(initialState, showLoading())).toEqual({
      ...initialState,
      loading: true,
    });
  });

  // Test hideLoading action
  it('should handle hideLoading', () => {
    expect(alertReducer({ ...initialState, loading: true }, hideLoading())).toEqual({
      ...initialState,
      loading: false,
    });
  });

  // Test setUserNotification action
  it('should handle setUserNotification', () => {
    const notifications = ['Notification 1', 'Notification 2'];
    expect(alertReducer(initialState, setUserNotification(notifications))).toEqual({
      ...initialState,
      user: {
        ...initialState.user,
        notification: notifications,
      },
    });
  });

  // Test setSeenNotification action
  it('should handle setSeenNotification', () => {
    const seenNotifications = ['Seen Notification 1'];
    expect(alertReducer(initialState, setSeenNotification(seenNotifications))).toEqual({
      ...initialState,
      user: {
        ...initialState.user,
        seennotification: seenNotifications,
      },
    });
  });
});



