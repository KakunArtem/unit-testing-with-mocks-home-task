import nock from 'nock';
import UserDataHandler from '../src/data_handlers/user_data_handler.mjs';
import {afterEach, beforeEach, describe, it} from 'mocha';

import {expect} from 'chai';


describe('UserDataHandler', () => {
    let userDataHandler;

    beforeEach(() => {
        userDataHandler = new UserDataHandler();
    });

    afterEach(() => {
        nock.cleanAll();
    });

    describe('loadUsers', () => {
        it('should load users data from the server', async () => {
            const mockUsers = [
                {id: 1, email: 'user1@example.com'},
                {id: 2, email: 'user2@example.com'}
            ];

            nock('http://localhost:3000').get('/users').reply(200, mockUsers);

            await userDataHandler.loadUsers();

            expect(userDataHandler.users).to.deep.equal(mockUsers);
        });
    });

    describe('getUserEmailsList', () => {
        it('should return a string containing all user emails separated by a semicolon', () => {
            userDataHandler.users = [
                {email: 'user1@example.com'},
                {email: 'user2@example.com'}
            ];

            const emailList = userDataHandler.getUserEmailsList();
            expect(emailList).to.equal('user1@example.com;user2@example.com');
        });

        it('should throw an error if no users are loaded', () => {
            expect(() => userDataHandler.getUserEmailsList()).to.throw('No users loaded!');
        });
    });

    describe('getNumberOfUsers', () => {
        it('should return the number of users', () => {
            userDataHandler.users = [
                {email: 'user1@example.com'},
                {email: 'user2@example.com'}
            ];

            const numberOfUsers = userDataHandler.getNumberOfUsers();
            expect(numberOfUsers).to.equal(2);
        });
    });

    describe('isMatchingAllSearchParams', () => {
        it('should return true if the user matches all search parameters', () => {
            const user = {id: 1, email: 'user1@example.com'};
            const searchParams = {id: 1, email: 'user1@example.com'};

            const isMatching = userDataHandler.isMatchingAllSearchParams(user, searchParams);
            expect(isMatching).to.be.true;
        });

        it('should return false if the user does not match all search parameters', () => {
            const user = {id: 1, email: 'user1@example.com'};
            const searchParams = {id: 2, email: 'user2@example.com'};

            const isMatching = userDataHandler.isMatchingAllSearchParams(user, searchParams);
            expect(isMatching).to.be.false;
        });
    });

    describe('findUsers', () => {
        it('should return an array of users that match the search parameters', () => {
            userDataHandler.users = [
                {id: 1, email: 'user1@example.com'},
                {id: 2, email: 'user2@example.com'}
            ];

            const searchParams = {email: 'user1@example.com'};
            const matchingUsers = userDataHandler.findUsers(searchParams);

            expect(matchingUsers).to.deep.equal([{id: 1, email: 'user1@example.com'}]);
        });

        it('should throw an error if no search parameters are provided', () => {
            expect(() => userDataHandler.findUsers()).to.throw('No search parameters provoded!');
        });

        it('should throw an error if no users are loaded', () => {
            expect(() => userDataHandler.findUsers({email: 'user1@example.com'})).to.throw('No users loaded!');
        });

        it('should throw an error if no matching users are found', () => {
            userDataHandler.users = [
                {id: 1, email: 'user1@example.com'},
                {id: 2, email: 'user2@example.com'}
            ];

            expect(() => userDataHandler.findUsers({email: 'user3@example.com'})).to.throw('No matching users found!');
        });
    });
});