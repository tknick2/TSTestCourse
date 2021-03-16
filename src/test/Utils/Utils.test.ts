import { Utils } from '../../app/Utils/Utils'
import { IncomingMessage } from 'http';

describe('Utils test suite', () => {

    test('getRequestPath valid request', () => {
        const request = {
            url: 'http://localhost:8080/login'
        } as IncomingMessage;
        const resultPath = Utils.getRequestBasePath(request);
        expect(resultPath).toBe('login');
    });

    test('getRequestPath with no path name', () => {
        const request = {
            url: 'http://localhost:8080/'
        } as IncomingMessage;
        const resultPath = Utils.getRequestBasePath(request);
        expect(resultPath).toBeFalsy();
    });

    test('getRequestPath with no path name', () => {
        const request = {
            url: ''
        } as IncomingMessage;
        const resultPath = Utils.getRequestBasePath(request);
        expect(resultPath).toBeFalsy();
    });

    test('getRequestBody', async () => {


        const requestMock = {
            write: jest.fn(),
            on: jest.fn(),
            end: jest.fn()
        }
        jest.mock('http', ()=>{
            request: jest.fn().mockImplementation((url, options, cb)=>{
                cb(requestMock)
            })
        });
        requestMock.on.mockImplementation((event, cb)=>{
            console.log('incoming event: ' + event)
            if (event == 'data') {
                cb('{ "name":"John", "age":30, "city":"New York"}')
            } else {
                cb()
            }

        });
        const response = await Utils.getRequestBody(requestMock as any);
        console.log(123)

    })
});