"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, Shield, Check, AlertCircle } from "lucide-react";

interface StripeWidgetProps {
  amount: number;
  currency: string;
  email: string;
  metadata?: {
    givingType: string;
    ministry?: string;
    isRecurring?: boolean;
    frequency?: string;
  };
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: any) => void;
}

export function StripeWidget({
  amount,
  currency,
  email,
  metadata,
  onSuccess,
  onError,
}: StripeWidgetProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [stripe, setStripe] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  const [cardElement, setCardElement] = useState<any>(null);
  const [cardError, setCardError] = useState<string>("");

  // Load Stripe
  useEffect(() => {
    const loadStripe = async () => {
      try {
        const stripeModule = await import('@stripe/stripe-js');
        const stripeInstance = await stripeModule.loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
        );
        
        if (stripeInstance) {
          setStripe(stripeInstance);
          
          const elementsInstance = stripeInstance.elements({
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: 'hsl(var(--primary))',
                colorBackground: 'hsl(var(--background))',
                colorText: 'hsl(var(--foreground))',
                colorDanger: 'hsl(var(--destructive))',
                fontFamily: 'system-ui, sans-serif',
                spacingUnit: '4px',
                borderRadius: '6px',
              },
            },
          });
          
          setElements(elementsInstance);
          setStripeLoaded(true);
        }
      } catch (error) {
        console.error('Failed to load Stripe:', error);
        toast({
          title: "Error",
          description: "Failed to load payment system. Please try again.",
          variant: "destructive",
        });
      }
    };

    loadStripe();
  }, [toast]);

  // Create card element when Stripe is loaded
  useEffect(() => {
    if (elements && !cardElement) {
      const card = elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: 'hsl(var(--foreground))',
            fontFamily: 'system-ui, sans-serif',
            '::placeholder': {
              color: 'hsl(var(--muted-foreground))',
            },
          },
        },
      });
      
      setCardElement(card);
      
      // Mount card element
      setTimeout(() => {
        const cardElementDiv = document.getElementById('stripe-card-element');
        if (cardElementDiv) {
          card.mount('#stripe-card-element');
          
          // Listen for card element changes
          card.on('change', (event: any) => {
            if (event.error) {
              setCardError(event.error.message);
            } else {
              setCardError('');
            }
          });
        }
      }, 100);
    }
  }, [elements, cardElement]);

  const processPayment = async () => {
    if (!stripe || !elements || !cardElement) {
      toast({
        title: "Error",
        description: "Payment system not ready. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setCardError('');

    try {
      // Create payment intent on the server
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency.toLowerCase(),
          metadata: {
            ...metadata,
            userId: user?.id,
            userDisplayName: user?.name || 'Anonymous',
            userEmail: email,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: email,
            name: user?.name || 'Anonymous Donor',
          },
        },
      });

      if (error) {
        console.error('Payment failed:', error);
        setCardError(error.message || 'Payment failed');
        onError(error);
        toast({
          title: "Payment Failed",
          description: error.message || "Your payment could not be processed.",
          variant: "destructive",
        });
      } else if (paymentIntent.status === 'succeeded') {
        toast({
          title: "Payment Successful!",
          description: `Thank you for your ${metadata?.givingType || 'donation'}. Payment ID: ${paymentIntent.id}`,
        });
        onSuccess(paymentIntent.id);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Pay with Stripe
        </CardTitle>
        <CardDescription>
          Secure international payments with credit and debit cards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Summary */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Amount:</span>
            <span className="font-semibold">
              {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : ''}
              {amount.toLocaleString()}
            </span>
          </div>
          {metadata?.givingType && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Type:</span>
              <span className="text-sm capitalize">{metadata.givingType}</span>
            </div>
          )}
          {metadata?.ministry && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Ministry:</span>
              <span className="text-sm">{metadata.ministry}</span>
            </div>
          )}
          {metadata?.isRecurring && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Frequency:</span>
              <span className="text-sm capitalize">{metadata.frequency || 'Monthly'}</span>
            </div>
          )}
        </div>

        {/* Card Element */}
        <div className="space-y-2">
          <Label htmlFor="stripe-card-element">Card Details</Label>
          <div className="border rounded-md p-3 bg-background">
            {stripeLoaded ? (
              <div id="stripe-card-element" className="min-h-[40px]" />
            ) : (
              <div className="min-h-[40px] flex items-center justify-center text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading card form...
              </div>
            )}
          </div>
          {cardError && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {cardError}
            </div>
          )}
        </div>

        {/* Accepted Cards */}
        <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-500" />
            Visa
          </div>
          <div className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-500" />
            Mastercard
          </div>
          <div className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-500" />
            American Express
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-green-50 p-3 rounded-lg">
          <Shield className="h-4 w-4 text-green-600" />
          <span>Payments are processed securely by Stripe with PCI DSS compliance</span>
        </div>

        {/* Payment Button */}
        <Button 
          onClick={processPayment}
          disabled={loading || !stripeLoaded || !cardElement}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : ''}{amount.toLocaleString()}
            </>
          )}
        </Button>

        {!stripeLoaded && (
          <p className="text-xs text-muted-foreground text-center">
            Loading secure payment form...
          </p>
        )}
      </CardContent>
    </Card>
  );
}