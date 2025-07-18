import { ProjectEntity } from "@/factory/entities/project.entity";
import { InjectRepository } from "@/factory/typeorm";
import type { DeepPartial, FindManyOptions, Repository } from "typeorm";
class ProjectService {
	constructor(private readonly projectRepository: Repository<ProjectEntity>) { }
	createNewProject(project: DeepPartial<ProjectEntity>) {
		const newProject = this.projectRepository.create(project);		 
		return this.projectRepository.save(newProject);
	}
	getAllProjects(opts?: FindManyOptions<ProjectEntity>) {
		return this.projectRepository.find(opts);
	}
	getProjectById(id: number) {
		return this.projectRepository.findOne({
			where: { id: id.toString() },
			relations: {
				website: true,
				webhooks: true,
				category: {
					templates: true
				}
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
				website: { domain },
			},
		});
	}
	updateProject(id: number, data: DeepPartial<ProjectEntity>) {
		return this.projectRepository.update(id, data);
	}
	deleteProject(id: number) {
		return this.projectRepository.softDelete(id);
	}
}

export const projectService = new ProjectService(
	InjectRepository(ProjectEntity),
);
