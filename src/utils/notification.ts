// Utility for showing notifications
export const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  const notification = document.createElement('div');
  
  const bgColor = type === 'success' ? 'linear-gradient(135deg, #4a5a4a, #5d6f5d)' :
                  type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' :
                  'linear-gradient(135deg, #3b82f6, #2563eb)';
  
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 80px;
      right: 20px;
      background: ${bgColor};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      font-family: system-ui;
      font-size: 14px;
      animation: slideIn 0.3s ease-out;
      max-width: 300px;
    ">
      ${message}
    </div>
    <style>
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    </style>
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
};