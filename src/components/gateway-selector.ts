import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";

import { PaymentGateway } from "../types/payment-form";
import { Gateway } from "../types/gateway";

@customElement("gateway-selector")
export class GatewaySelector extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        sans-serif;
    }

    .gateway-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      padding: 16px;
    }

    .gateway-card {
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }

    .gateway-card:hover {
      border-color: #007bff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .gateway-card.selected {
      border-color: #007bff;
      background: #f0f8ff;
    }

    .gateway-card.selected::after {
      content: "✓";
      position: absolute;
      top: 8px;
      right: 8px;
      background: #007bff;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    }

    .gateway-logo {
      font-size: 32px;
      margin-bottom: 8px;
    }

    .gateway-name {
      font-weight: 600;
      font-size: 16px;
      color: #333;
      margin-bottom: 4px;
    }

    .gateway-description {
      font-size: 12px;
      color: #666;
      line-height: 1.3;
    }

    .selected-gateway {
      background: #f8f9fa;
      padding: 16px;
      border-radius: 4px;
      margin-bottom: 20px;
      text-align: center;
    }

    .selected-text {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }

    .selected-name {
      font-size: 18px;
      font-weight: 600;
      color: #007bff;
    }
  `;

  @state() private selectedGateway: PaymentGateway | null = null;

  private gateways: Gateway[] = [
    {
      id: "stripe",
      name: "Stripe",
      logo: "💳",
      description: "Fast, secure payments",
    },
    {
      id: "paypal",
      name: "PayPal",
      logo: "🅿️",
      description: "Pay with PayPal account",
    },
  ];

  render() {
    return html`
      ${this.selectedGateway
        ? html`
            <div class="selected-gateway">
              <div class="selected-text">Selected Payment Gateway:</div>
              <div class="selected-name">
                ${this.gateways.find((g) => g.id === this.selectedGateway)
                  ?.name}
              </div>
            </div>
          `
        : ""}

      <div class="gateway-grid">
        ${this.gateways.map(
          (gateway) => html`
            <div
              class="gateway-card ${gateway.id === this.selectedGateway
                ? "selected"
                : ""}"
              @click=${() => this.selectGateway(gateway.id)}
            >
              <div class="gateway-logo">${gateway.logo}</div>
              <div class="gateway-name">${gateway.name}</div>
              <div class="gateway-description">${gateway.description}</div>
            </div>
          `
        )}
      </div>
    `;
  }

  private selectGateway(gateway: PaymentGateway) {
    this.selectedGateway = gateway;

    this.dispatchEvent(
      new CustomEvent("gateway-selected", {
        detail: { gateway },
        bubbles: true,
        composed: true,
      })
    );
  }

  // Public method to get selected gateway
  getSelectedGateway(): PaymentGateway | null {
    return this.selectedGateway;
  }

  // Public method to set gateway programmatically
  setGateway(gateway: PaymentGateway) {
    this.selectedGateway = gateway;
  }
}
