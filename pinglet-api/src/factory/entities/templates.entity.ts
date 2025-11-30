import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { NotificationEntity } from "./notifications.entity";
import { TemplateCategoryEntity } from "./template-category.entity";
import { UserEntity } from "./users.entity";
import { DEFAULT_STYLES } from "@/handlers/services/default/constant";
import { TemplateConfig } from "@/utils/interfaces/template.interface";
@Entity("templates")
export class TemplatesEntity {
    @PrimaryGeneratedColumn("increment")
    id!: number;

    @Column()
    name!: string;

    @Column({ nullable: true })
    description!: string;

    @Column("jsonb", { default: { html: "", css: "" } })
    raw_text!: { html: string, css: string };

    @Column("varchar")
    compiled_text!: string;

    @Column({ type: "text", default: [], array: true })
    variables!: string[];

    @Column({ type: "jsonb", default: DEFAULT_STYLES })
    config!: TemplateConfig;

    @Column({ default: true })
    is_active!: boolean;

    @Column({ default: false })
    is_default!: boolean;

    @Column({ default: "u" })
    type!: string;

    @ManyToOne(() => TemplatesEntity, (template) => template.variants, {
        onDelete: "SET NULL",
        nullable: true,
    })
    @JoinColumn({ name: "parent_id" })
    parent!: Relation<TemplatesEntity> | null;


    @OneToMany(() => TemplatesEntity, (template) => template.parent)
    variants!: Relation<TemplatesEntity[]>;

    @ManyToOne(
        () => TemplateCategoryEntity,
        (project) => project.templates,
        { onDelete: "CASCADE" },
    )
    @JoinColumn({ name: "category_id" })
    category!: Relation<TemplateCategoryEntity>;

    @OneToMany(
        () => NotificationEntity,
        (notification) => notification.id, { nullable: true }
    )
    notifications!: NotificationEntity[];

    @ManyToOne(
        () => UserEntity,
        (u) => u.id, { nullable: true, onDelete: "SET NULL", }
    )
    user!: Relation<UserEntity> | null;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @DeleteDateColumn()
    deleted_at!: Date | null;

}
