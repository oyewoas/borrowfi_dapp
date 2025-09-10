import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {
  return (
    <div className="py-4 px-12 flex items-center justify-between">
      <h1 className="text-2xl font-bold">BorrowFi</h1>
      <ConnectButton />
    </div>
  );
};

export default Header;
