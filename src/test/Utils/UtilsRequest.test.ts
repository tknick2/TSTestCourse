import { Utils } from '../../app/Utils/Utils'
import { IncomingMessage } from 'http';

describe('Utils test suite', () => {

    const requestMock = {
        on: jest.fn()
    }

    jest.mock('http', () => {
        request: jest.fn().mockImplementation((url, options, cb) => {
            cb(requestMock)
        })
    });
    const someObject = {
        name: 'John',
        age: 30,
        city: 'Paris'
    }
    const someObjectAsString = JSON.stringify(someObject);

    test('getRequestBody with valid JSON', async () => {
        requestMock.on.mockImplementation((event, cb) => {
            if (event == 'data') {
                cb(someObjectAsString)
            } else {
                cb()
            }
        });
        const response = await Utils.getRequestBody(requestMock as any);
        expect(response).toEqual(someObject)
    })
    test('getRequestBody with invalid JSON', async () => {
        requestMock.on.mockImplementation((event, cb) => {
            if (event == 'data') {
                cb('5' + someObjectAsString)
            } else {
                cb()
            }
        });
        await expect(Utils.getRequestBody(requestMock as any)).rejects.toThrow('Unexpected token { in JSON at position 1');
    })

    test('getRequestBody with unexpected error', async () => {
        const someError = new Error('something went wrong!')
        requestMock.on.mockImplementation((event, cb) => {
            if (event == 'error') {
                cb(someError)
            } else if(event == 'data') {
                cb(someObjectAsString)
            }
        });
        await expect(Utils.getRequestBody(requestMock as any)).rejects.toThrow(someError.message);
    })
});