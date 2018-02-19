# rxjs-firebase-simple
[![CircleCI](https://circleci.com/gh/dkwares/rxjs-firebase-simple.svg?style=svg)](https://circleci.com/gh/dkwares/rxjs-firebase-simple)
This is a simple RxJS interface to [Google Firebase](https://firebase.google.com/). 
```
npm install rxjs-firebase-simple --save
```

## API Documentation
[Documentation](documentation/)

## Usage
This simple utility helps getting data from firebase and converting the data into an observable stream. Each function returns an Observable stream that closes after getting a single value, except for ```listen$```, which stays open until you manually unsubscribe from the stream.
```typescript
import * as rxfirebase from 'rxjs-firebase-simple';

rxfirebase.get$('/users').subscribe(value => {
  // perform operations on value
})

rxfirebase.getChildrenByPath$('/users', 'username', 'johndoe').subscribe(value => {
  // perform operations on value
})

rxfirebase.getByQuery$('/users', (ref => ref.orderByChild('username').equalTo('johndoe'))).subscribe(value => {
  // perform operations on value
})

rxfirebase.set$('/users', 'user value').subscribe(value => {
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

rxfirebase.get$('/users', 'defaultValue').subscribe(value => {
  // perform operations on value. The value will be 'defaultValue'
  // if firebase returns a null value at '/users'
})
```

If you do not provide a default value, you can still provide a type to ensure that the return type from firebase is the one you give. This does not force firebase to return an object of that type, only that you know what type should be returned.
```typescript
import * as rxfirebase from 'rxjs-firebase-simple';

rxfirebase.get$<string>('/users').subscribe(value => {
  // perform operations on value. value will be typed as a string
})
```
