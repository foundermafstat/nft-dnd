'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useNotificationStore } from '@/store/notificationStore';

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'success':
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    case 'error':
      return <ExclamationCircleIcon className="w-5 h-5 text-red-500" />;
    case 'warning':
      return <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />;
    case 'info':
    default:
      return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
  }
};

const NotificationSystem = () => {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed bottom-16 left-4 z-50 space-y-2 max-w-sm md:bottom-4">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="bg-card border border-border rounded-lg shadow-lg p-4 flex items-start"
          >
            <div className="flex-shrink-0 mr-3">
              <NotificationIcon type={notification.type} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">{notification.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-4 flex-shrink-0 text-muted-foreground hover:text-foreground"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSystem;