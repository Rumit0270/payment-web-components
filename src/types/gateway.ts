import { PaymentGateway } from "./payment-form";

export interface Gateway {
  id: PaymentGateway;
  name: string;
  logo: string;
  description: string;
}

export interface GatewaySelectedEvent {
  gateway: PaymentGateway;
}
