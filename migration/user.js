import { Column } from 'mysql-easy-builder';

export const usersTable = {
    tableName: 'users',
    columns: [
        (new Column()).name('id').primary(),
        (new Column()).name('email').varchar(60).notnull(),
        (new Column()).name('password').varchar(255).notnull(),
    ]
};
