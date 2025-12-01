import serverAxios from "@/lib/api/server.instance"
import { EditTemplatePage } from "./client.page"



interface EditTemplatePageProps {
    params: {
        id: string
    }
}
export default async function Page({ params }: EditTemplatePageProps) {
    try {
        const { id } = await params

        const { data } = await serverAxios.get(`/api/v1/template/${id}`)
        if (!data.success) {
            throw new Error(data.message)
        }

        return <EditTemplatePage data={data.result} />
    } catch (error: any) {

        return <div>{error.message}</div>
    }
}

