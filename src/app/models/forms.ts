import { Sequelize } from './sequelize';

export class Forms extends Sequelize {
    form_id: number;
    user_id: number;
    document: Blob;
}