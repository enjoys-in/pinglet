import { CronJob } from "@/utils/decorators/cron-job.decorator";
import { notificationFlusherService } from "../services/notificationFlusher";

class CronJobs {

    @CronJob("EVERY_10_SECONDS")
    async FlushDataToDb() {
        notificationFlusherService.fetchAllRegisteredProjects();
    }
}


export default new CronJobs();