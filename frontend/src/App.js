import React, { useState, createContext, useContext } from "react";

// --- CONTEXTE AUTHENTIFICATION ---
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const register = async (username, email, password) => {
    try {
      const res = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }
      setUser({ username, email });
      return true;
    } catch (err) {
      alert("Erreur inscription : " + err.message);
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // corrigé ici : email au lieu de username
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }
      const data = await res.json();
      setToken(data.token);
      setUser({ username: data.username });
      return true;
    } catch (err) {
      alert("Erreur login : " + err.message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

// --- FORMULAIRE LOGIN / REGISTER ---
function LoginRegisterForm() {
  const { login, register, user } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  if (user) return <p>You are logged in as {user.username || user.email}</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isRegister) {
      if (!username) return setError("Username is required for registration");
      const ok = await register(username, email, password);
      if (!ok) setError("Registration failed");
    } else {
      const ok = await login(email, password);
      if (!ok) setError("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: "auto" }}>
      <h2>{isRegister ? "Register" : "Login"}</h2>

      {isRegister && (
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ display: "block", marginBottom: 10, width: "90%" }}
        />
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ display: "block", marginBottom: 10, width: "90%" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ display: "block", marginBottom: 10, width: "90%" }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">{isRegister ? "Register" : "Login"}</button>

      <p>
        <button
          type="button"
          onClick={() => {
            setError("");
            setIsRegister(!isRegister);
          }}
          style={{
            marginTop: 10,
            background: "none",
            border: "none",
            color: "blue",
            cursor: "pointer",
          }}
        >
          {isRegister ? "Already have an account? Login" : "No account? Register"}
        </button>
      </p>
    </form>
  );
}

// --- COMPONENTES ENCHERES ---
function AuctionList({ auctions, onSelect }) {
  return (
    <div>
      <h3>Auctions</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {auctions.map((a) => (
          <li
            key={a.id}
            style={{ padding: 10, border: "1px solid #ddd", marginBottom: 5, cursor: "pointer" }}
            onClick={() => onSelect(a)}
          >
            {a.title} — Current Price: ${a.current_price}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AuctionCreate({ onCreate }) {
  const [title, setTitle] = useState("");
  const [startingPrice, setStartingPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !startingPrice) return alert("Please fill all fields");
    const newAuction = {
      id: Math.floor(Math.random() * 10000),
      title,
      current_price: Number(startingPrice),
    };
    onCreate(newAuction);
    setTitle("");
    setStartingPrice("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      <h3>Create Auction</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{ display: "block", marginBottom: 10, width: "95%" }}
      />
      <input
        type="number"
        placeholder="Starting Price"
        value={startingPrice}
        onChange={(e) => setStartingPrice(e.target.value)}
        required
        style={{ display: "block", marginBottom: 10, width: "95%" }}
      />
      <button type="submit">Create</button>
    </form>
  );
}

function BidList({ bids }) {
  if (!bids.length) return <p>No bids yet.</p>;
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {bids.map((b) => (
        <li key={b.id}>
          User {b.user_id} bid ${b.amount} at {new Date(b.timestamp).toLocaleTimeString()}
        </li>
      ))}
    </ul>
  );
}

function BidForm({ auction, onPlaceBid }) {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Number(amount) <= auction.current_price) {
      alert(`Bid must be higher than current price: $${auction.current_price}`);
      return;
    }
    onPlaceBid({ auction_id: auction.id, amount: Number(amount), user_id: 1, timestamp: Date.now(), id: Math.random() });
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 10 }}>
      <input
        type="number"
        placeholder={`Bid more than $${auction.current_price}`}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <button type="submit">Place Bid</button>
    </form>
  );
}

// --- PAGE ENCHERES (après login) ---
function AuctionPage() {
  const { user } = useAuth();
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [auctions, setAuctions] = useState([
    { id: 1, title: "iPhone 14 Pro", current_price: 1200 },
    { id: 2, title: "MacBook Pro 16\"", current_price: 2500 },
  ]);
  const [bids, setBids] = useState([]);

  const handleCreateAuction = (auction) => {
    setAuctions((prev) => [...prev, auction]);
  };

  const handleSelectAuction = (auction) => {
    setSelectedAuction(auction);
    setBids([]); // à remplacer par récupération bids backend plus tard
  };

  const handlePlaceBid = (bid) => {
    setBids((prev) => [...prev, bid]);
    setAuctions((prev) =>
      prev.map((a) => (a.id === bid.auction_id ? { ...a, current_price: bid.amount } : a))
    );
  };

  if (!user) return <p>Please login to access auctions.</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Welcome {user.username}</h2>
      <AuctionCreate onCreate={handleCreateAuction} />
      <AuctionList auctions={auctions} onSelect={handleSelectAuction} />
      {selectedAuction && (
        <div>
          <h3>{selectedAuction.title}</h3>
          <p>Current price: ${selectedAuction.current_price}</p>
          <BidList bids={bids} />
          <BidForm auction={selectedAuction} onPlaceBid={handlePlaceBid} />
        </div>
      )}
    </div>
  );
}

// --- HEADER avec bouton Logout ---
function Header() {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        padding: "10px 20px",
        backgroundColor: "#333",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h1 style={{ margin: 0 }}>Auction Platform</h1>
      {user && (
        <button
          onClick={logout}
          style={{
            padding: "5px 10px",
            cursor: "pointer",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: 3,
          }}
        >
          Logout
        </button>
      )}
    </header>
  );
}

// --- APP PRINCIPALE ---
function App() {
  const { user } = useAuth();

  return (
    <>
      <Header />
      {user ? <AuctionPage /> : <LoginRegisterForm />}
    </>
  );
}

// --- EXPORT ---
export default function RootApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
