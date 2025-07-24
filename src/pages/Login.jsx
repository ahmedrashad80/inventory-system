import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        ` ${import.meta.env.VITE_API_URL}api/user/login`,
        {
          method: "POST",
          credentials: "include", // مهم لتخزين الكوكيز
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        navigate("/"); // أو أي صفحة بعد الدخول
      } else {
        console.log("Login failed:", data);
        setError(data.message || "فشل تسجيل الدخول");
      }
    } catch (err) {
      console.log("Login error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">تسجيل الدخول</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border rounded-lg px-3 py-2">
            <User className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="اسم المستخدم"
              className="w-full px-2 outline-none bg-transparent"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center border rounded-lg px-3 py-2">
            <Lock className="w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="كلمة المرور"
              className="w-full px-2 outline-none bg-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            دخول
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
