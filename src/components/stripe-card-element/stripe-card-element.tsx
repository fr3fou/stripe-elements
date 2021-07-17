import { Component, Prop, h, State, Method, Element } from '@stencil/core';
import { loadStripe, Stripe, StripeCardCvcElement, StripeCardExpiryElement, StripeCardNumberElement } from '@stripe/stripe-js';


export type FormSubmitHandler = (event: Event, component: MyComponent) => Promise<void>

@Component({
  tag: 'stripe-card-element',
  styleUrl: 'stripe-card-element.css',
  shadow: false,
})
export class MyComponent {

  @Element() el: HTMLElement;
  /**
   * Your Stripe publishable API key.
   */
  @Prop() publishableKey: string;

  @State() loadStripeStatus: '' | 'loading' | 'success' | 'failure' =  ''

  @State() stripe: Stripe

  @Prop() handleSubmit?: FormSubmitHandler;

  private cardNumber!:StripeCardNumberElement
  private cardExpiry!:StripeCardExpiryElement
  private cardCVC!:StripeCardCvcElement

  constructor() {
    if (this.publishableKey) {
      this.initStripe(this.publishableKey)
    }
  }

  /**
   * Set form submit event function
   * @param handler FormSubmitHandler
   */
   @Method()
   public async setFormSubmitHandler(handler: FormSubmitHandler) {
     this.handleSubmit = handler
   }

   /**
    * Get Stripe.js, and initialize elements
    * @param publishableKey 
    */
  @Method()
  public async initStripe(publishableKey: string) {
    this.loadStripeStatus = 'loading'
    loadStripe(publishableKey)
      .then(stripe => {
        this.loadStripeStatus = 'success'
        this.stripe = stripe
        return
      }).catch(e => {
        console.log(e)
        this.loadStripeStatus = 'failure'
        return
      })
      .then(() => {
        if (!this.stripe) return
        return this.initElement()
      })
  }

  /**
   * Initialize Component using Stripe Element
   */
  private async initElement() {
    const elements = this.stripe.elements()
    const cardErrorElement = document.getElementById('card-errors')
    const handleCardError =  ({error})  => {
      if (error) {
        cardErrorElement.textContent = error.message;
        cardErrorElement.classList.add('visible');
      } else {
        cardErrorElement.classList.remove('visible');
      }
    }

    this.cardNumber = elements.create('cardNumber')
    const cardNumberElement = document.getElementById('card-number')
    this.cardNumber.mount(cardNumberElement)
    this.cardNumber.on('change', handleCardError);
    
    this.cardExpiry = elements.create('cardExpiry')
    const cardExpiryElement = document.getElementById('card-expiry')
    this.cardExpiry.mount(cardExpiryElement)
    this.cardExpiry.on('change', handleCardError);

    this.cardCVC = elements.create('cardCvc')
    const cardCVCElement = document.getElementById('card-cvc')
    this.cardCVC.mount(cardCVCElement)
    this.cardCVC.on('change', handleCardError);
  }

  render() {
    if (this.loadStripeStatus === 'failure') {
      return <p>Failed to load Stripe</p>
    }
    return (
      <form onSubmit={(e) => {
        if (!this.handleSubmit) return;
        this.handleSubmit(e, this)
      }}>
        <h1>Add your payment information</h1>
        <div>
          <h2>Card information</h2>
        </div>
          <div class="payment-info card visible">
            <fieldset>

              <label>
                <span>Email</span>
                <input name="email" type="email" class="field" placeholder="jenny@example.com" required />
              </label>
            </fieldset>
            <fieldset>
              <div>
                <label>
                  <lenged>Card Number</lenged>
                  <div id="card-number"/>
                </label>
                </div>
              <div style={{display: 'flex'}}>
                <label style={{width: '50%'}}>
                  <lenged>MM / YY</lenged>
                  <div id="card-expiry"/>
                </label>
                <label style={{width: '50%'}}>
                  <lenged>CVC</lenged>
                  <div id="card-cvc" />
                </label>
              </div>
              <div id="card-errors" class="element-errors"></div>
            </fieldset>
          </div>
          <button type="submit">Save</button>
      </form>
    );
  }
}