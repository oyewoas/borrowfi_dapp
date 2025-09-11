import Header from "./components/Header";
import StatusSection from "./components/StatusSection";
import BorrowSection from "./components/BorrowSection";
import RepaySection from "./components/RepaySection";
import AddCollateralSection from "./components/AddCollateralSection";
import WithdrawCollateralSection from "./components/WithdrawCollateralSection";
import ApproveCLT from "./components/ApproveCLT";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header />
      <main className="flex flex-col items-center px-4 md:px-12 lg:px-24 py-8 gap-8 w-full">
        <StatusSection />
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10 justify-items-center">
          <ApproveCLT />
          <AddCollateralSection />
          <WithdrawCollateralSection />
          <BorrowSection />
          <RepaySection />
        </div>
      </main>
    </div>
  );
};

export default App;
