import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Unique,
    DeleteDateColumn,
    UpdateDateColumn,
    ManyToOne,
    Relation,
    JoinColumn,
    Index,
} from "typeorm";
import { ProjectEntity } from "./project.entity";

@Entity("push_subscriptions")
@Unique(["endpoint", "project_id"])
export class PushSubscriptionEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text", { nullable: true })
    info!: string;

    @ManyToOne(() => ProjectEntity, (p) => p.unique_id)
    @JoinColumn({ name: "project_id", referencedColumnName: "unique_id" })
    project!: Relation<ProjectEntity>;

    @Column("varchar")
    @Index()
    project_id!: string;

    @Column()
    endpoint!: string;

    @Column({ nullable: true })
    expirationTime!: string;

    @Column("jsonb")
    keys!: {
        p256dh: string;
        auth: string;
    };

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamp", onUpdate: "CURRENT_TIMESTAMP", default: () => "CURRENT_TIMESTAMP" })
    updated_at!: Date;

    @DeleteDateColumn({ type: "timestamp", onUpdate: "CURRENT_TIMESTAMP", nullable: true, default: null })
    is_deleted!: boolean;
}
