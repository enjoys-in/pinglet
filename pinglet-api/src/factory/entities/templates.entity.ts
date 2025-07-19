import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { NotificationEntity } from "./notifications.entity";
import { TemplateCategoryEntity } from "./template-category.entity";
import { UserEntity } from "./users.entity";
const DEFAULT_TEMPLATE = {
    alt: "Pinglet",
    src: "/placeholder.png",
    width: 100,
}
const defaultStyles = {
    btn1: {
        color: "#fff",
        backgroundColor: "#000",
    },
    btn2: {
        color: "#fff",
        backgroundColor: "#000",
    },
    text: {},
    heading: {},
    media: {
        image: DEFAULT_TEMPLATE,
        video: DEFAULT_TEMPLATE,
        logo: DEFAULT_TEMPLATE,
        icon: DEFAULT_TEMPLATE
    },
    position: "bottom-left",
    transition: "fade", // or "slide", "zoom"
    branding: {
        show: true,
        html: `Notifications by <a href="https://pinglet.enjoys.in" style="color:#4da6ff;text-decoration:none;" target="_blank">Pinglet</a> - Enjoys`,
    },
    sound: {
        play: true,
        src: "https://pinglet.enjoys.in/api/v1/pinglet-sound.mp3?v=1&ext=mp3",
    },
    duration: 2000,

};

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

    @Column({ type: "jsonb", default: {} })
    variables!: Record<string, string>;

    @Column({ type: "jsonb", default: defaultStyles })
    config!: Record<string, string>;

    @Column({ default: true })
    is_active!: boolean;

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
    user!: Relation<UserEntity>| null;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

}
