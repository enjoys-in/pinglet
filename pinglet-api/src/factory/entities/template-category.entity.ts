import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./users.entity";
import { TemplatesEntity } from "./templates.entity";
import { ProjectEntity } from "./project.entity";

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
    user!: Relation<UserEntity>;



    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

}
