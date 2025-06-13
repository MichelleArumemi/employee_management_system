import React, { useContext, useEffect } from 'react';
import { BellIcon, CheckIcon } from '@heroicons/react/outline';
import NotificationContext from '../../../context/notification/notificationContext.jsx';
import UserContext from '../../../context/user/userContext';
import { formatDate } from '../../../utils/formatDate';

const Notifications = () => {
  const notificationContext = useContext(NotificationContext);
  const userContext = useContext(UserContext);
  const { notifications, getNotifications, markAsRead } = notificationContext;
  const { users } = userContext;

  useEffect(() => {
    getNotifications();
    // eslint-disable-next-line
  }, []);

  const getUserName = (userId) => {
    const user = users.find(user => user._id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'System';
  };

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Your Notifications
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {notifications.length === 0 ? (
            <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
              <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
              <p className="mt-1 text-sm text-gray-500">You don't have any notifications yet.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`px-4 py-4 sm:px-6 ${!notification.isRead ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary-600">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      From: {getUserName(notification.sender)} • {formatDate(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="ml-4 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <CheckIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;