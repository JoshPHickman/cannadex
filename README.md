*Cannadex V.1*

*Introduction:*
Allows users to scan their cannabis product bar codes to create a journal entry linked to their email/password account. If product information cannot be generated from a barcode scan users are prompted to provide product information so that they themselves and future users will be provided with a product reference in future.

*Future Version Goals*
* Creating a public API for an extensive database of Canadian cannabis products.
* Google user authentication.
* Improved scanning capabilities, specifically stacked bar codes.
* General performance & UI improvements.
* IOS support.

*Technical Specifications*
* Firebase is used for email/password authentication as well as a Firestore NoSQL real time database
* Expo Camera is used as the scanner component.
* Third party dependencies were used for tab navigation.

*Build Dependencies*
* npx expo install firebase
* npm install @react-navigation/bottom-tabs
* npm install @react-navigation/native
* npx expo install expo camera


