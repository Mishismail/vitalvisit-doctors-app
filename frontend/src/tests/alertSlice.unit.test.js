import alertReducer, { 
  showLoading, 
  hideLoading, 
  setUserNotification, 
  setSeenNotification 
} from '../redux/features/alertSlice';

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

const initialState = {
  loading: false,
  user: {
    notification: [],
    seennotification: [],
  },
};

describe('alertSlice reducer', () => {
  it('should handle initial state', () => {
    expect(alertReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle showLoading', () => {
    expect(alertReducer(initialState, showLoading())).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('should handle hideLoading', () => {
    expect(alertReducer({ ...initialState, loading: true }, hideLoading())).toEqual({
      ...initialState,
      loading: false,
    });
  });

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


