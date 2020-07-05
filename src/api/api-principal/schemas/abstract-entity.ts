import {CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

export abstract class AbstractEntity {
    @PrimaryGeneratedColumn()
    id: number | undefined;
    @CreateDateColumn(
        {
            name: 'created_at',
            type: 'datetime',
            nullable: false,
        },
    )
    createdAt: Date | undefined;
    @UpdateDateColumn({
            name: 'updated_at',
            type: 'datetime',
            nullable: false,
        },
    )
    updatedAt: Date | undefined;
}
