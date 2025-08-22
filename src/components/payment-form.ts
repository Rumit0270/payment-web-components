import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { Currency, PaymentData, PaymentGateway } from "../types/payment-form";

@customElement("payment-form")
export class PaymentForm extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        sans-serif;
      max-width: 400px;
    }

    .payment-container {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .amount-display {
      background: #f8f9fa;
      padding: 16px;
      border-radius: 4px;
      text-align: center;
      margin-bottom: 20px;
    }

    .amount-value {
      font-size: 24px;
      font-weight: bold;
      color: #007bff;
    }

    .gateway-selector {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .gateway-btn {
      padding: 8px 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s;
    }

    .gateway-btn:hover {
      border-color: #007bff;
    }

    .gateway-btn.active {
      background: #007bff;
      color: white;
      border-color: #007bff;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-row {
      display: flex;
      gap: 12px;
    }

    .form-row .form-group {
      flex: 1;
    }

    label {
      display: block;
      margin-bottom: 4px;
      font-weight: 500;
      font-size: 14px;
      color: #333;
    }

    input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }

    input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .submit-btn {
      width: 100%;
      padding: 14px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    .submit-btn:hover:not(:disabled) {
      background: #0056b3;
    }

    .submit-btn:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    .success-message {
      background: #d4edda;
      color: #155724;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 16px;
      border: 1px solid #c3e6cb;
    }

    .error-message {
      background: #f8d7da;
      color: #721c24;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 16px;
      border: 1px solid #f5c6cb;
    }
  `;

  @property({ type: String }) amount = "";
  @property({ type: String }) currency: Currency = "USD";
  @property({ type: String }) gateway: PaymentGateway = "stripe";

  @state() private isProcessing = false;
  @state() private message = "";
  @state() private messageType: "success" | "error" | "" = "";

  private gateways = [
    { id: "stripe" as PaymentGateway, name: "Stripe" },
    { id: "paypal" as PaymentGateway, name: "PayPal" },
  ];

  private selectGateway(gateway: PaymentGateway) {
    this.gateway = gateway;
    this.dispatchEvent(
      new CustomEvent("gateway-change", {
        detail: { gateway },
      })
    );
  }

  private formatCardNumber(e: Event) {
    const input = e.target as HTMLInputElement;
    let value = input.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
    input.value = formattedValue;
  }

  private formatExpiry(e: Event) {
    const input = e.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    input.value = value;
  }

  private async handleSubmit(e: Event) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const paymentData: PaymentData = {
      cardHolder: (form.querySelector("#cardHolder") as HTMLInputElement).value,
      cardNumber: (
        form.querySelector("#cardNumber") as HTMLInputElement
      ).value.replace(/\s/g, ""),
      expiryDate: (form.querySelector("#expiry") as HTMLInputElement).value,
      cvv: (form.querySelector("#cvv") as HTMLInputElement).value,
      amount:
        this.amount ||
        (form.querySelector("#amount") as HTMLInputElement)?.value ||
        "0",
      currency: this.currency,
      gateway: this.gateway,
    };

    await this.processPayment(paymentData);
  }

  private async processPayment(data: PaymentData) {
    this.isProcessing = true;
    this.message = "";
    this.messageType = "";

    console.log("Processing payment for: ", data);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success/failure (70% success rate for demo)
      const isSuccess = Math.random() > 0.3;

      if (isSuccess) {
        const transactionId = "txn_" + Math.random().toString(36).substr(2, 9);

        this.message = `Payment successful! Transaction ID: ${transactionId}`;
        this.messageType = "success";

        this.dispatchEvent(
          new CustomEvent("payment-success", {
            detail: { ...data, transactionId },
          })
        );
      } else {
        this.message = "Payment failed. Please try again.";
        this.messageType = "error";

        this.dispatchEvent(
          new CustomEvent("payment-error", {
            detail: {
              error: "Payment declined",
              code: "PAYMENT_DECLINED",
            },
          })
        );
      }
    } catch (error) {
      this.message = "An error occurred. Please try again.";
      this.messageType = "error";
    } finally {
      this.isProcessing = false;
    }
  }

  render() {
    return html`
      <div class="payment-container">
        ${this.amount
          ? html`
              <div class="amount-display">
                <div class="amount-value">${this.currency} ${this.amount}</div>
              </div>
            `
          : ""}

        <div class="gateway-selector">
          ${this.gateways.map(
            (g) => html`
              <button
                class="gateway-btn ${g.id === this.gateway ? "active" : ""}"
                @click=${() => this.selectGateway(g.id)}
              >
                ${g.name}
              </button>
            `
          )}
        </div>

        ${this.message
          ? html`
              <div class="${this.messageType}-message">${this.message}</div>
            `
          : ""}

        <form @submit=${this.handleSubmit}>
          <div class="form-group">
            <label for="cardHolder">Card Holder Name</label>
            <input
              type="text"
              id="cardHolder"
              required
              placeholder="John Doe"
            />
          </div>

          <div class="form-group">
            <label for="cardNumber">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              required
              placeholder="1234 5678 9012 3456"
              @input=${this.formatCardNumber}
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="expiry">Expiry Date</label>
              <input
                type="text"
                id="expiry"
                required
                placeholder="MM/YY"
                @input=${this.formatExpiry}
              />
            </div>
            <div class="form-group">
              <label for="cvv">CVV</label>
              <input
                type="text"
                id="cvv"
                required
                placeholder="123"
                maxlength="4"
              />
            </div>
          </div>

          <button
            type="submit"
            class="submit-btn"
            ?disabled=${this.isProcessing}
          >
            ${this.isProcessing ? "Processing..." : "Process Payment"}
          </button>
        </form>
      </div>
    `;
  }
}
