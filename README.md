# rxjs-firebase-simple
[![CircleCI](https://circleci.com/gh/dkwares/rxjs-firebase-simple.svg?style=svg)](https://circleci.com/gh/dkwares/rxjs-firebase-simple)
This is a simple RxJS interface to [Google Firebase](https://firebase.google.com/). 
```
npm install rxjs-firebase-simple --save
```

## API Documentation
[Documentation](documentation/)

## Usage
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

rxfirebase.listen$('/users').subscribe(value => {
  // Gets a new value every time the path is updated
  // perform operations on value
})
```
