import { Column, CreateDateColumn, DeleteDateColumn, Entity,  ManyToOne, OneToMany,  PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./users.entity";
import { TemplatesEntity } from "./templates.entity";

@Entity("template_category")
export class TemplateCategoryEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    slug!: string;

    @Column({ nullable: true })
    description!: string;

    @Column({ default: true })
    is_active!: boolean;

    @OneToMany(
        () => TemplatesEntity,
        (t) => t.category, { nullable: true }
    )
    templates!: TemplatesEntity[];

    @ManyToOne(
        () => UserEntity,
        (u) => u.id, { nullable: true, onDelete: "SET NULL", }
    )
    user!: Relation<UserEntity>| null;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

}
