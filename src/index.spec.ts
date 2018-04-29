import { concatMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import * as rxfirebase from './index';

describe('RxJS Firebase Simple', () => {
    let ref: jasmine.Spy, set: jasmine.Spy, once: jasmine.Spy, val: jasmine.Spy;
    let equalTo: jasmine.Spy, orderByChild: jasmine.Spy, on: jasmine.Spy;
    const path = '/test/path'

    let promiseResolved: boolean;
    function _resolvePromise(val?: any) {
        return new Promise((resolve, reject) => {
            resolve(val);
            promiseResolved = true;
        });
    }

    function subscribeAndExpect(obs$: Observable<any>, fn: (result: any) => void) {
        expect(promiseResolved).toBe(false)
        setTimeout(() => {
            expect(promiseResolved).toBe(false)
            obs$.subscribe(res => {
                expect(promiseResolved).toBe(true);
                fn(res);
            });
        }, 50)
    }

    beforeEach(() => {
        promiseResolved = false;
        on = jasmine.createSpy('on');
        val = jasmine.createSpy('val');
        set = jasmine.createSpy('set').and.callFake(() => _resolvePromise())
        once = jasmine.createSpy('once').and.callFake(() => _resolvePromise({ val }))
        equalTo = jasmine.createSpy('equalTo').and.returnValue({ once })
        orderByChild = jasmine.createSpy('orderByChild').and.returnValue({ equalTo });
        ref = jasmine.createSpy('ref').and.returnValue({ set, once, orderByChild, on })

        spyOn(firebase, 'database').and.returnValue({ ref })
    })

    afterEach(() => {
        expect(ref).toHaveBeenCalledWith(path);
    })

    describe('#set$', () => {
        it('should set the value on firebase', (done: DoneFn) => {
            const data = 'test-data'
            subscribeAndExpect(rxfirebase.set$(path, data), result => {
                expect(ref).toHaveBeenCalledWith(path);
                expect(set).toHaveBeenCalledWith(data);
                expect(result).toBe(data);
                done();
            })
        })
    })

    describe('#get$', () => {
        afterEach(() => {
            expect(once).toHaveBeenCalledWith('value')
        })

        it('should get the value from firebase', (done: DoneFn) => {
            const data = 'data'
            val.and.returnValue(data);
            subscribeAndExpect(rxfirebase.get$(path), result => {
                expect(result).toBe(data)
                done();
            })
        })

        it('should return a default value when no data is found', (done: DoneFn) => {
            const defaultVal = 'defaultValue';
            val.and.returnValue(null);
            subscribeAndExpect(rxfirebase.get$(path, defaultVal), result => {
                expect(result).toBe(defaultVal);
                done();
            })
        })

        it('should return null without a default value and no data is found', (done: DoneFn) => {
            val.and.returnValue(null);
            subscribeAndExpect(rxfirebase.get$(path), result => {
                expect(result).toBeNull();
                done();
            })
        })
    })

    describe('#getChildrenByPath$', () => {
        const childPath = '/path/to/child'
        const equalToValue = 'equalToVal';

        afterEach(() => {
            expect(once).toHaveBeenCalledWith('value')
            expect(orderByChild).toHaveBeenCalledWith(childPath)
            expect(equalTo).toHaveBeenCalledWith(equalToValue);
        })

        it('should get an array of children at a given path', (done: DoneFn) => {
            const data = {
                id1: 'value1',
                id2: 'value1',
                id3: 'value1',
            };
            val.and.returnValue(data);

            subscribeAndExpect(rxfirebase.getChildrenByPath$(path, childPath, equalToValue), result => {
                expect(result).toEqual(Object.values(data))
                done();
            })
        })

        it('should return a default value when no data is found', (done: DoneFn) => {
            const defaultVal = ['defaultValue'];
            val.and.returnValue(null);
            subscribeAndExpect(rxfirebase.getChildrenByPath$(path, childPath, equalToValue, defaultVal), result => {
                expect(result).toBe(defaultVal);
                done();
            })
        })

        it('should return null without a default value and no data is found', (done: DoneFn) => {
            val.and.returnValue(null);
            subscribeAndExpect(rxfirebase.getChildrenByPath$(path, childPath, equalToValue), result => {
                expect(result).toBeNull();
                done();
            })
        })
    })

    describe('#getByQuery$', () => {
        const childPath = '/path/to/child';
        const equalToValue = 'equalToVal';

        afterEach(() => {
            expect(once).toHaveBeenCalledWith('value')
        })

        it('should get a json of objects provided a custom query at a given path', (done: DoneFn) => {
            const data = {
                id1: 'value1',
                id2: 'value1',
                id3: 'value1',
            };
            val.and.returnValue(data);

            subscribeAndExpect(rxfirebase.getByQuery$(path, (_ref => _ref.orderByChild(childPath).equalTo(equalToValue))), result => {
                expect(result).toBe(data)
                done();
            })
        })

        it('should return a default value when no data is found', (done: DoneFn) => {
            const defaultVal = { id: 'defaultValue' };
            val.and.returnValue(null);
            subscribeAndExpect(rxfirebase.getByQuery$(path, (_ref => _ref.orderByChild(childPath).equalTo(equalToValue)), defaultVal), result => {
                expect(result).toBe(defaultVal);
                done();
            })
        })

        it('should return null without a default value and no data is found', (done: DoneFn) => {
            val.and.returnValue(null);
            subscribeAndExpect(rxfirebase.getByQuery$(path, (_ref => _ref.orderByChild(childPath).equalTo(equalToValue))), result => {
                expect(result).toBeNull();
                done();
            })
        })
    })

    describe('#listen$', () => {
        it('should listen for new values from firebase', (done: DoneFn) => {
            let value = '';
            let isDone = false;

            let onValueFn = (snapshot: any) => { };
            on.and.callFake((on: string, fn: (snapshot: any) => void) => {
                onValueFn = fn;
            });

            rxfirebase.listen$(path).subscribe(result => {
                expect(result).toBe(value);
                if (isDone) done();
            })

            value = 'data'
            onValueFn({ val: () => value })

            value = 'data1'
            onValueFn({ val: () => value })

            value = 'data2'
            isDone = true;
            onValueFn({ val: () => value })
        })
    })
})