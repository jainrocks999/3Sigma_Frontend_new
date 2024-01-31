import React from 'react';
import {StripeProvider} from '@stripe/stripe-react-native';

export default function StripePaymentWrapper(props: any) {
  return (
    <StripeProvider
      publishableKey="pk_live_51NFW8lSGRFlxZecWKdNqQlMgUI6hwuKTnw2LTS0r3c43W2sFcRFTzGZ6xMg0KrrL0JfCtiRRtbNSnaAwA4KVRNKT00Go7QwTg3"
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      merchantIdentifier="merchant.com.3sigma" // required for Apple Pay
    >
      {props.children}
    </StripeProvider>
  );
}
