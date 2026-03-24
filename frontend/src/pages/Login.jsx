import { useState } from "react";
import { loginUser } from "./api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = {
      email: username,
      password: password,
    };

    try {
      const res = await loginUser(data);
      if (res && res.access) {
        if (res.user?.role === 'company') {
          window.location.href = "/dashboard/company";
        } else {
          window.location.href = "/dashboard/applicant";
        }
      } else {
        alert("Invalid Credentials ❌");
      }
    } catch (error) {
      alert("Login Failed ❌");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient p-4 font-body">
      <div className="max-w-md w-full card p-8 sm:p-10 animate-fade-up">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-extrabold text-gray-900 mb-2">
            Talent<span className="gradient-text">Bridge</span>
          </h1>
          <p className="text-gray-500 font-body">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="username">
              Email / Username
            </label>
            <input
              id="username"
              type="text"
              className="input-field"
              placeholder="e.g. arjun@email.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary flex justify-center items-center py-3 mt-6 shadow-glow"
            disabled={isLoading}
          >
            {isLoading ? <div className="spinner w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div> : "Sign In"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
          <p className="mb-3 font-semibold text-gray-700">Test Accounts</p>
          <div className="space-y-2">
            <div className="bg-gray-50 p-2 rounded-lg flex justify-between items-center text-xs">
              <span className="badge-full-time">Applicant</span>
              <span className="font-mono text-gray-700">arjun@email.com (Pass: password123)</span>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg flex justify-between items-center text-xs">
              <span className="badge-remote">Company</span>
              <span className="font-mono text-gray-700">priya@techcorp.in (Pass: password123)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;