import { WidgetEntity } from "@/factory/entities/widget.entity";
import { InjectRepository } from "@/factory/typeorm";
import type { DeepPartial, FindManyOptions, Repository } from "typeorm";
class WigdetService {
	constructor(private readonly widgetRepo: Repository<WidgetEntity>) {
		this.widgetRepo = widgetRepo;
	}
	createNewWidget(Widget: DeepPartial<WidgetEntity>) {
		const newWidget = this.widgetRepo.create(Widget);
		return this.widgetRepo.save(newWidget);
	}
	getAllWidgets(opts?: FindManyOptions<WidgetEntity>) {
		return this.widgetRepo.find(opts);
	}
	getWidgetById(id: number) {
		return this.widgetRepo.findOneBy({ id });
	}
	getWidgetByWidgetId(widgetId: string) {
		return this.widgetRepo.findOneBy({ widget_id: widgetId });
	}
	getWidgetsByUserId(id: number) {
		return this.widgetRepo.find({ where: { user: { id } } });
	}
	updateWidget(id: number, data: DeepPartial<WidgetEntity>) {
		return this.widgetRepo.update(id, data);
	}
	deleteWidget(id: number) {
		return this.widgetRepo.softDelete(id);
	}
}

export const WidgetService = new WigdetService(InjectRepository(WidgetEntity));
