import { ProjectEntity } from "@/factory/entities/project.entity";
import { InjectRepository } from "@/factory/typeorm";
import type {
	DeepPartial,
	FindManyOptions,
	FindOneOptions,
	Repository,
} from "typeorm";
type RestorePayload =
	| { unique_id: string }
	| { id: number }
	| {
			website: {
				domain: string;
			};
	  }
	| {
			website: {
				id: number;
			};
	  };
class ProjectService {
	constructor(private readonly projectRepository: Repository<ProjectEntity>) {}
	createNewProject(project: DeepPartial<ProjectEntity>) {
		const newProject = this.projectRepository.create(project);
		return this.projectRepository.save(newProject);
	}
	getAllProjects(opts?: FindManyOptions<ProjectEntity>) {
		return this.projectRepository.find(opts);
	}
	getSelectedProjects(opts: FindOneOptions<ProjectEntity>) {
		return this.projectRepository.findOne(opts);
	}
	getProjectById(id: number) {
		return this.projectRepository.findOne({
			where: { id },
			relations: {
				website: true,
				webhooks: true,
				category: true,
			},
		});
	}
	getProjectsByUserId(id: number) {
		return this.projectRepository.find({
			where: { website: { user: { id: id } } },
		});
	}
	getProjectsByWebsiteId(id: number) {
		return this.projectRepository.findOne({
			where: {
				website: { id: id },
			},
		});
	}
	getProjectsByWebsite(domain: string) {
		return this.projectRepository.findOne({
			where: {
				website: { domain, is_active: true },
			},
		});
	}
	updateProject(id: number, data: DeepPartial<ProjectEntity>) {
		return this.projectRepository.update(id, data);
	}
	deleteProject(id: number) {
		return this.projectRepository.softDelete(id);
	}
	deleteProjectByWebsiteId(id: number) {
		return this.projectRepository.softDelete({ website: { id: id } });
	}
	restoreProject(data: RestorePayload) {
		return this.projectRepository.restore(data);
	}
	getAllProjectWithSubsAndNotificationCount(userId: number) {
		return this.projectRepository
			.createQueryBuilder("project")
			.leftJoinAndSelect("project.website", "website")
			.leftJoinAndSelect("project.category", "category")
			.leftJoin("notifications", "n", "n.project_id = project.unique_id")
			.select([
				"project.id as id",
				"project.unique_id as unique_id",
				"project.name as name",
				"project.created_at as created_at",
				"project.logo as logo",
				"project.is_active as is_active",
				"website.name ",
				"website.domain",
				"category.name as category_name",
				"category.slug as category_slug",
			])
			.addSelect((subQuery) => {
				return subQuery
					.select("COUNT(*)", "count")
					.from("push_subscriptions", "ps")
					.where("ps.project_id = project.unique_id");
			}, "subscriptions")
			.addSelect("n.total_sent", "sent_notications")
			.addSelect("n.total_clicked", "total_clicked")

			.where("project.user_id = :userId", { userId })
			.getRawMany();
	}
}

export const projectService = new ProjectService(
	InjectRepository(ProjectEntity),
);
