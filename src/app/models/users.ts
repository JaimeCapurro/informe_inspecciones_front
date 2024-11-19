import { Sequelize } from './sequelize';

export class Users extends Sequelize {
    user_id: number;
    user: string; 
    pword: string;
    nombre: string;
    rol: boolean; 
}