"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, Shield, Check } from "lucide-react";

interface PaystackWidgetProps {
  amount: number;
  currency: string;
  email: string;
  reference?: string;
  metadata?: {
    givingType: string;
    ministry?: string;
    isRecurring?: boolean;
    frequency?: string;
  };
  onSuccess: (reference: string) => void;
  onError: (error: any) => void;
  onClose?: () => void;
}

export function PaystackWidget({
  amount,
  currency,
  email,
  reference,
  metadata,
  onSuccess,
  onError,
  onClose,
}: PaystackWidgetProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => setPaystackLoaded(true);
    script.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to load Paystack. Please try again.",
        variant: "destructive",
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [toast]);

  const initiatePayment = async () => {
    if (!paystackLoaded) {
      toast({
        title: "Payment System Loading",
        description: "Please wait while we load the payment system.",
      });
      return;
    }

    setLoading(true);

    try {
      // Generate payment reference if not provided
      const paymentReference = reference || `LSC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Initialize Paystack payment
      const handler = (window as any).PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: email,
        amount: amount * 100, // Convert to kobo (lowest currency unit)
        currency: currency,
        ref: paymentReference,
        metadata: {
          ...metadata,
          userId: user?.id,
          userDisplayName: user?.name || 'Anonymous',
          custom_fields: [
            {
              display_name: "Giving Type",
              variable_name: "giving_type",
              value: metadata?.givingType || "offering"
            },
            ...(metadata?.ministry ? [{
              display_name: "Ministry",
              variable_name: "ministry",
              value: metadata.ministry
            }] : []),
            ...(metadata?.isRecurring ? [{
              display_name: "Recurring",
              variable_name: "is_recurring",
              value: "true"
            }] : []),
          ]
        },
        callback: function(response: any) {
          // Payment successful
          toast({
            title: "Payment Successful!",
            description: `Thank you for your ${metadata?.givingType || 'donation'}. Reference: ${response.reference}`,
          });
          
          // Call success handler
          onSuccess(response.reference);
          setLoading(false);
        },
        onClose: function() {
          // Payment cancelled
          if (onClose) {
            onClose();
          }
          setLoading(false);
        }
      });

      // Open Paystack popup
      handler.openIframe();

    } catch (error) {
      console.error('Paystack payment error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
      onError(error);
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Pay with Paystack
        </CardTitle>
        <CardDescription>
          Secure payment with cards, bank transfer, USSD, or mobile money
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Summary */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Amount:</span>
            <span className="font-semibold">
              {currency === 'NGN' ? '₦' : currency === 'USD' ? '$' : ''}
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

        {/* Payment Methods Info */}
        <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-500" />
            Cards (Visa, Mastercard)
          </div>
          <div className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-500" />
            Bank Transfer
          </div>
          <div className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-500" />
            USSD Codes
          </div>
          <div className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-500" />
            Mobile Money
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-green-50 p-3 rounded-lg">
          <Shield className="h-4 w-4 text-green-600" />
          <span>Your payment is secured with 256-bit SSL encryption</span>
        </div>

        {/* Payment Button */}
        <Button 
          onClick={initiatePayment}
          disabled={loading || !paystackLoaded}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay {currency === 'NGN' ? '₦' : currency === 'USD' ? '$' : ''}{amount.toLocaleString()}
            </>
          )}
        </Button>

        {!paystackLoaded && (
          <p className="text-xs text-muted-foreground text-center">
            Loading payment system...
          </p>
        )}
      </CardContent>
    </Card>
  );
}