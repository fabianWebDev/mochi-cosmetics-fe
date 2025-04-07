const LoginForm = ({ formData, onChange, onSubmit, loading, error }) => (
    <form onSubmit={onSubmit} className="login-form">
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                required
                disabled={loading}
            />
        </div>
        <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                required
                disabled={loading}
            />
        </div>
        <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
        </button>
    </form>
);

export default LoginForm;
