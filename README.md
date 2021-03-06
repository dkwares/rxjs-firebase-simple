# rxjs-firebase-simple
[![CircleCI](https://circleci.com/gh/dkwares/rxjs-firebase-simple.svg?style=svg)](https://circleci.com/gh/dkwares/rxjs-firebase-simple)
[![npm version](https://badge.fury.io/js/rxjs-firebase-simple.svg)](https://badge.fury.io/js/rxjs-firebase-simple)

This is a simple RxJS interface to [Google Firebase](https://firebase.google.com/). 
```
npm install rxjs-firebase-simple --save
```

## Useful Links
[Stackblitz Demo](https://stackblitz.com/edit/rxjs-firebase-simple-demo?file=index.ts)

[API Documentation](documentation/)

## Usage
This simple utility helps getting data from firebase and converting the data into an Observable stream. Each function returns an Observable stream that closes after getting a single value, except for ```listen$```, which stays open until you unsubscribe from the stream.

**IMPORTANT** The instance of firebase which you are using needs to be authenticated with your private firebase credentials inside of your app. An instance of firebase does not have to be passed to any of these functions.

```typescript
import * as rxfirebase from 'rxjs-firebase-simple';

rxfirebase.get$('/users/john').subscribe(value => {
  // perform operations on value
})

rxfirebase.getChildrenByPath$('/users', 'username', 'john').subscribe(value => {
  // perform operations on value
})

rxfirebase.getByQuery$('/users', (ref => ref.orderByChild('username').equalTo('john'))).subscribe(value => {
  // perform operations on value
})

rxfirebase.set$('/users/amanda', {name: 'amanda', email: 'amanda@mail.com'}).subscribe(value => {
  // get the same value that was set on
})

rxfirebase.listen$('/users').subscribe(value => {
  // Gets a new value every time the path is updated
  // perform operations on value
})
```

### Default Values and Generics
In addition to the general use, you can also provide default values if no values are returned from firebase, either because the path is incorrect or there are no values at that location. If you provide a default value, the type of the resulting value is inferred from it.
```typescript
import * as rxfirebase from 'rxjs-firebase-simple';

rxfirebase.get$('/users/john/name', 'defaultValue').subscribe(value => {
  // perform operations on value. The value will be 'defaultValue'
  // if firebase returns a null value at '/users'
})
```

If you do not provide a default value, you can still provide a type to ensure that the return type from firebase is the one you give. This does not force firebase to return an object of that type, only that you know what type should be returned.
```typescript
import * as rxfirebase from 'rxjs-firebase-simple';

rxfirebase.get$<string>('/users/john/name').subscribe(value => {
  // perform operations on value. value will be typed as a string
})
```
