import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { forwardRef, useState } from 'react';

const PasswordField = forwardRef(function PasswordField({ className = '', ...props }, ref) {
  const [visible, setVisible] = useState(false);
  return (
    <span className={`password-field ${className}`.trim()}>
      <input ref={ref} className="mbn-control mbn-control--password" type={visible ? 'text' : 'password'} {...props} />
      <button
        type="button"
        className="password-field__toggle"
        aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
      >
        {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
      </button>
    </span>
  );
});

export default PasswordField;
