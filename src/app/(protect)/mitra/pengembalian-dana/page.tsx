import RefundTable from "./components/RefundTable";

const page = () => {
  return (
    <div>
      <div className="mb-2">
        <p className="text-13 font-medium text-black">Pengembalian Dana</p>
        <p className="text-12 text-black/60">
          Ajukan pengembalian dana untuk pesanan yang memenuhi syarat secara
          mudah dan transparan
        </p>
      </div>
      <RefundTable />
    </div>
  );
};
export default page;
