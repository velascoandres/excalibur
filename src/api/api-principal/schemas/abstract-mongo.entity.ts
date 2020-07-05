import {Column, ObjectID, ObjectIdColumn} from 'typeorm';

export abstract class AbstractMongoEntity {
    @ObjectIdColumn()
    id?: ObjectID;

    @Column({
            type: 'date',
            name: 'updated_at',
        },
    )
    updatedAt: Date = new Date();
}