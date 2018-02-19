import * as firebase from 'firebase';
import * as rxfirebase from './index';

describe('RxJS Firebase Simple', () => {
    let ref: jasmine.Spy, set: jasmine.Spy, once: jasmine.Spy, val: jasmine.Spy;
    let equalTo: jasmine.Spy, orderByChild: jasmine.Spy, on: jasmine.Spy;
    const path = '/test/path'
    beforeEach(() => {
        on = jasmine.createSpy('on');
        val = jasmine.createSpy('val');
        set = jasmine.createSpy('set').and.returnValue(Promise.resolve())
        once = jasmine.createSpy('once').and.returnValue(Promise.resolve({ val }))
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
            rxfirebase.set$(path, data).subscribe(result => {
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
            rxfirebase.get$(path).subscribe(result => {
                expect(result).toBe(data)
                done();
            })
        })

        it('should return a default value when no data is found', (done: DoneFn) => {
            const defaultVal = 'defaultValue';
            val.and.returnValue(null);
            rxfirebase.get$(path, defaultVal).subscribe(result => {
                expect(result).toBe(defaultVal);
                done();
            })
        })

        it('should return null without a default value and no data is found', (done: DoneFn) => {
            val.and.returnValue(null);
            rxfirebase.get$(path).subscribe(result => {
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

            rxfirebase.getChildrenByPath$(path, childPath, equalToValue).subscribe(result => {
                expect(result).toEqual(Object.values(data))
                done();
            })
        })

        it('should return a default value when no data is found', (done: DoneFn) => {
            const defaultVal = ['defaultValue'];
            val.and.returnValue(null);
            rxfirebase.getChildrenByPath$(path, childPath, equalToValue, defaultVal).subscribe(result => {
                expect(result).toBe(defaultVal);
                done();
            })
        })

        it('should return null without a default value and no data is found', (done: DoneFn) => {
            val.and.returnValue(null);
            rxfirebase.getChildrenByPath$(path, childPath, equalToValue).subscribe(result => {
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

            rxfirebase.getByQuery$(path, (_ref => _ref.orderByChild(childPath).equalTo(equalToValue))).subscribe(result => {
                expect(result).toBe(data)
                done();
            })
        })

        it('should return a default value when no data is found', (done: DoneFn) => {
            const defaultVal = { id: 'defaultValue' };
            val.and.returnValue(null);
            rxfirebase.getByQuery$(path, (_ref => _ref.orderByChild(childPath).equalTo(equalToValue)), defaultVal).subscribe(result => {
                expect(result).toBe(defaultVal);
                done();
            })
        })

        it('should return null without a default value and no data is found', (done: DoneFn) => {
            val.and.returnValue(null);
            rxfirebase.getByQuery$(path, (_ref => _ref.orderByChild(childPath).equalTo(equalToValue))).subscribe(result => {
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