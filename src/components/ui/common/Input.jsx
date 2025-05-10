const Input = ({ label, name, value, onChange, error, type = "text" }) => (
    <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={`form-control ${error ? "is-invalid" : ""}`}
        />
        {error && <div className="invalid-feedback">{error}</div>}
    </div>
);

export default Input;