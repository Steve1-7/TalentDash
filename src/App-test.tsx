import { createRoot } from "react-dom/client";

const TestApp = () => {
  return (
    <div style={{ padding: '20px', background: 'white', color: 'black' }}>
      <h1>Test App - If you see this, React is working!</h1>
      <p>This is a simple test to check if React is rendering properly.</p>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<TestApp />);
