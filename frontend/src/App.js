import React, { useState, createContext, useContext } from "react";

// ----- CONTEXTE AUTHENTIFICATION -----
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Simule login (à remplacer par appel API)
  const login = (email, password) => {
    if (email === "test@test.com" && password === "123456") {
      setUser({ email });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const register = (email, password) => {
    // Simule inscription
    setUser({ email });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

// ----- COMPONENTES UI -----

// Navbar simple
function NavBar() {
  const { user, logout } = useAuth();
  return (
    <nav style={{ padding: "1em", borderBottom: "1px solid #ccc" }}>
      <span style={{ marginRight: 20 }}>Real-Time Auction</span>
      {user ? (
        <>
          <span style={{ marginRight: 10 }}>Hello, {user.email}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <span>Hello ! please login 👋</span>
      )}
    </nav>
  );
}

// Formulaire login + register
function LoginRegisterForm() {
  const { login, register, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  if (user) return <p>You are logged in as {user.email}</p>;

  const handleSubmit = e => {
    e.preventDefault();
    if (isRegister) {
      register(email, password);
    } else {
      const ok = login(email, password);
      if (!ok) setError("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: "auto"}}>
      <h2>{isRegister ? "Register" : "Login"}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{ display: "block", marginBottom: 10, width: "90%" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
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
          style={{ marginTop: 10, background: "none", border: "none", color: "blue", cursor: "pointer" }}
        >
          {isRegister ? "Already have an account? Login" : "No account? Register"}
        </button>
      </p>
    </form>
  );
}

// Liste des enchères
function AuctionList({ onSelect }) {
  // Exemple de données en dur, remplacer par fetch API
  const [auctions] = useState([
    { id: 1, title: "Samsung S24", current_price: 1200 },
    { id: 2, title: "MacBook Pro 16\"", current_price: 2500 },
  ]);

  return (
    <div>
      <h3>Auctions</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {auctions.map(a => (
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

// Formulaire création enchère
function AuctionCreate({ onCreate }) {
  const [title, setTitle] = useState("");
  const [startingPrice, setStartingPrice] = useState("");

  const handleSubmit = e => {
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
        onChange={e => setTitle(e.target.value)}
        required
        style={{ display: "block", marginBottom: 10, width: "100%" }}
      />
      <input
        type="number"
        placeholder="Starting Price"
        value={startingPrice}
        onChange={e => setStartingPrice(e.target.value)}
        required
        style={{ display: "block", marginBottom: 10, width: "100%" }}
      />
      <button type="submit">Create</button>
    </form>
  );
}

// Liste des offres pour une enchère
function BidList({ bids }) {
  if (!bids.length) return <p>No bids yet.</p>;
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {bids.map(b => (
        <li key={b.id}>
          User {b.user_id} bid ${b.amount} at {new Date(b.timestamp).toLocaleTimeString()}
        </li>
      ))}
    </ul>
  );
}

// Formulaire pour faire une offre
function BidForm({ auction, onPlaceBid }) {
  const [amount, setAmount] = useState("");

  const handleSubmit = e => {
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
        onChange={e => setAmount(e.target.value)}
        required
      />
      <button type="submit">Place Bid</button>
    </form>
  );
}

// PAGE PRINCIPALE qui combine tout
function AuctionPage() {
  const { user } = useAuth();
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [auctions, setAuctions] = useState([
    { id: 1, title: "iPhone 14 Pro", current_price: 1200 },
    { id: 2, title: "MacBook Pro 16\"", current_price: 2500 },
  ]);
  const [bids, setBids] = useState([]);

  // Ajouter une nouvelle enchère
  const handleCreateAuction = auction => {
    setAuctions(prev => [...prev, auction]);
  };

  // Sélection enchère
  const handleSelectAuction = auction => {
    setSelectedAuction(auction);
    // Reset les bids ou charger depuis API
    setBids([]);
  };

  // Ajouter une offre
  const handlePlaceBid = bid => {
    setBids(prev => [...prev, bid]);
    // Met à jour le prix courant
    setAuctions(prev =>
      prev.map(a => (a.id === bid.auction_id ? { ...a, current_price: bid.amount } : a))
    );
  };

  if (!user) return <p>Please login to access auctions.</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Welcome {user.email}</h2>
      <AuctionCreate onCreate={handleCreateAuction} />
      <AuctionList onSelect={handleSelectAuction} auctions={auctions} />
      {selectedAuction && (
        <div style={{ marginTop: 20 }}>
          <h3>Selected Auction: {selectedAuction.title}</h3>
          <BidList bids={bids.filter(b => b.auction_id === selectedAuction.id)} />
          <BidForm auction={selectedAuction} onPlaceBid={handlePlaceBid} />
        </div>
      )}
    </div>
  );
}

// --------- APP ROOT ---------
function App() {
  const { user } = useAuth();

  return (
    <>
      <NavBar />
      <div style={{ padding: 20 }}>
        {!user ? <LoginRegisterForm /> : <AuctionPage />}
      </div>
    </>
  );
}

// ----- EXPORT ROOT AVEC PROVIDER -----
export default function RootApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
