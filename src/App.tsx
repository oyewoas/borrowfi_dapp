import Header from "./components/Header";
import StatusSection from "./components/StatusSection";
import CollateralSection from "./components/CollateralSection";
import BorrowSection from "./components/BorrowSection";
import RepaySection from "./components/RepaySection";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header />
      <main className="flex flex-col items-center p-8 gap-8">
        <StatusSection />
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8">
          <CollateralSection />
          <BorrowSection />
          <RepaySection />
        </div>
      </main>
    </div>
  );
};

export default App;
