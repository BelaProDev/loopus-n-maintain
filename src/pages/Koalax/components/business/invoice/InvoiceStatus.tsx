import { Invoice } from "@/types/business";
import { useTranslation } from "react-i18next";

interface InvoiceStatusProps {
  status: Invoice['status'];
}

const InvoiceStatus = ({ status }: InvoiceStatusProps) => {
  const { t } = useTranslation(["admin"]);

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default InvoiceStatus;