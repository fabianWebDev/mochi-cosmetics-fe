const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const buttonClass = `btn btn-${variant} ${className}`;
  
  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};

export default Button;
