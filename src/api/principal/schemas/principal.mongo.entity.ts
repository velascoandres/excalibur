import {Column, ObjectID, ObjectIdColumn} from 'typeorm';

export class PrincipalMongoEntity {
    @ObjectIdColumn()
    id?: ObjectID;

    @Column({
        type: 'date',
        name: 'updated_at',
    })
    updatedAt: Date = new Date();
}