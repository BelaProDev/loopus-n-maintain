import { useParams } from "@remix-run/react";
import MessageList from "../pages/Koalax/components/messages/MessageList";
import { ContactMessage } from "../lib/fauna/types";

export default function MessageServiceRoute() {
  const { service } = useParams();
  
  if (!service || !['electrics', 'plumbing', 'ironwork', 'woodwork', 'architecture'].includes(service)) {
    return <div>Invalid service</div>;
  }

  return <MessageList service={service as ContactMessage['service']} />;
}