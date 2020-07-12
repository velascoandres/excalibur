import {CreateDateColumn, ObjectID, ObjectIdColumn, UpdateDateColumn} from 'typeorm';

export abstract class AbstractMongoEntity {
    @ObjectIdColumn(
        {
        }
    )
    id?: ObjectID;
    @CreateDateColumn(
        {
            type: 'datetime',
            name: 'created_at',
        }
    )
    createdAt: Date | undefined;
    @UpdateDateColumn(
        {
            type: 'datetime',
            name: 'updated_at',
        }
    )
    updatedAt: Date | undefined;
}