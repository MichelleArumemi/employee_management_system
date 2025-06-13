import React, { useContext, useState } from 'react';
import { BellIcon, PaperAirplaneIcon } from '@heroicons/react/outline';
import UserContext from '../context/user/userContext';
import NotificationContext from '../context/notification/notificationContext';

const NotificationsAdmin = () => {
  const userContext = useContext(UserContext);
  const notificationContext = useContext(NotificationContext);
  const { users } = userContext;
  const { sendNotification } = notificationContext;

  const [formData, setFormData] = useState({
    recipient: '',
    title: '',
    message: ''
  });

  const { recipient, title, message } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendNotification({
        recipient,
        title,
        message
      });
      setFormData({
        recipient: '',
        title: '',
        message: ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Send Notifications</h1>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Create New Notification
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
                  Recipient
                </label>
                <select
                  id="recipient"
                  name="recipient"
                  value={recipient}
                  onChange={onChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="">Select an employee</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={title}
                  onChange={onChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  value={message}
                  onChange={onChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PaperAirplaneIcon className="-ml-1 mr-2 h-5 w-5" />
                Send Notification
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NotificationsAdmin;