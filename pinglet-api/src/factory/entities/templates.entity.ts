import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { NotificationEntity } from "./notifications.entity";
import { ProjectEntity } from "./project.entity";
import { TemplateCategoryEntity } from "./template-category.entity";

@Entity("templates")
export class TemplatesEntity {
    @PrimaryGeneratedColumn("increment")
    id!: number;

    @Column()
    name!: string;

    @Column({ nullable: true })
    description!: string;

    @Column("varchar")
    raw_text!: string;

    @Column("varchar")
    compiled_text!: string;

    @Column({ type: "jsonb", default: {} })
    variables!: Record<string, string>;

    @Column({ default: true })
    is_active!: boolean;

    @ManyToOne(
            () => TemplateCategoryEntity,
            (project) => project.templates,
            { onDelete: "CASCADE" },
        )
    @JoinColumn({ name: "category_id" })
    category!: Relation<TemplateCategoryEntity>;

    @OneToMany(
        () => NotificationEntity,
        (notification) => notification.category, { nullable: true }
    )
    notifications!: NotificationEntity[];

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

}
