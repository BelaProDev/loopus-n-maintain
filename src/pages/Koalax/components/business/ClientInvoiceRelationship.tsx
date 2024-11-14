import { useQuery } from "@tanstack/react-query";
import { businessQueries } from "@/lib/fauna/business";
import { Card } from "@/components/ui/card";
import { Client, Invoice } from "@/types/business";
import { useTranslation } from "react-i18next";

const ClientInvoiceRelationship = () => {
  const { t } = useTranslation(["admin"]);
  
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: businessQueries.getClients,
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: businessQueries.getInvoices,
  });

  const getClientInvoices = (clientId: string) => {
    return invoices.filter((invoice: Invoice) => invoice.clientId === clientId) || [];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {clients.map((client: Client) => {
        const clientInvoices = getClientInvoices(client.id);
        const totalAmount = clientInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
        
        return (
          <Card key={client.id} className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{client.name}</h3>
                <p className="text-sm text-gray-500">{client.company}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {clientInvoices.length} {t("admin:business.invoices.title")}
                </p>
                <p className="text-sm text-gray-500">
                  €{totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              {clientInvoices.map((invoice: Invoice) => (
                <div
                  key={invoice.id}
                  className="text-sm p-2 bg-gray-50 rounded-md flex justify-between"
                >
                  <span>{invoice.number}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                    invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {invoice.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ClientInvoiceRelationship;