import { z } from "zod";

// Icon/media schema
const mediaSchema = z.object({
  type: z.union([z.literal("icon"), z.literal("image"), z.literal("video"), z.literal("audio"), z.literal("iframe")]),
  src: z.any().optional(),
}).strict();
// Buttons schema
const buttonSchema = z.object({
  text: z.string(),
  onClick: z.string(), // we accept stringified function for frontend usage
}).strict();

// Theme and branding schema
const overridesSchema = z.object({
  position: z.string().optional(),
  transition: z.enum(["fade", "slide", "zoom"]).optional(),
  branding: z.object({
    show: z.boolean(),
    html: z.string(),
  }).optional(),
  sound: z.object({
    play: z.boolean(),
    src: z.string(),
    volume: z.number(),
  }).optional(),
  duration: z.number().optional(),
  vibration: z.array(z.any()).optional(),
  maxVisible: z.number().optional(),
  stacking: z.boolean().optional(),
  auto_dismiss: z.boolean().optional(),
  dismissible: z.boolean().optional(),
  website: z.string().optional(),
  time: z.boolean().optional(),
  favicon: z.boolean().optional(),
  pauseOnHover: z.boolean().optional(),
  theme: z.object({
    mode: z.enum(["light", "dark", "auto"]).optional(),
    customClass: z.string().optional(),
    rounded: z.boolean().optional(),
    shadow: z.boolean().optional(),
    border: z.boolean().optional(),
  }).optional(),
  iconDefaults: z.object({
    show: z.boolean().optional(),
    size: z.number().optional(),
    position: z.enum(["left", "right", "top"]).optional(),
  }).optional(),
  progressBar: z.object({
    show: z.boolean(),
    color: z.string().optional(),
    height: z.number().optional(),
  }).optional(),
}).strict();
// Main Schema
export const notificationSchema = z.object({
  projectId: z.string().length(20),
  type: z.union([z.literal("-1"), z.literal("0"), z.literal("1")]),
  variant: z.string().optional(),
  template_id: z.string().optional(),
  tag: z.string().optional(),
  overrides: overridesSchema.optional(),

  body: z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    media: mediaSchema.optional(),
    buttons: z.array(buttonSchema).optional(),
    actions: z.array(z.object({ action: z.union([z.literal("redirect"), z.literal("alert")]), title: z.string() })).optional(),
  }).optional(),

  data: z.record(z.any(), z.any()).optional()
})
  .superRefine((data, ctx) => {
    const isTemplate = data.template_id !== undefined;
    const isVariant = data.variant !== undefined;

    if (data.type === "1") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["custom_template"],
        message: "Custom template is not supported yet,feature coming soon",
      });

    }
    // 1. If type is "1", template_id is required
    if (data.type === "1" && !isTemplate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["template_id"],
        message: "`template_id` is required when type is '1'",
      });
    }

    // 2. If type is not "1", template_id must not be present
    if (data.type !== "1" && isTemplate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["template_id"],
        message: "`template_id` must not be provided unless type is '1'",
      });
      if (data.type == "0" && (data.body?.actions || !data.body?.buttons)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["buttons", "actions"],
          message: "`buttons` is required when type is '0' and `actions` is not allowed",
        });
      }
      if (data.type == "-1" && (!data.body?.actions || data.body?.buttons)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["buttons", "actions"],
          message: "`actions` is required when type is '-1' and `buttons` is not allowed",
        });
      }
    }

    // 3. variant and template_id cannot both exist
    if (isTemplate && isVariant) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["template_id"],
        message: "`variant` and `template_id` cannot both be used together",
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["variant"],
        message: "`variant` and `template_id` cannot both be used together",
      });
    }

    // 4. If template_id is present: data is required, body is not allowed
    if (isTemplate) {
      if (!data.data) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["data"],
          message: "`data` is required when using `template_id`",
        });
      }
      if (data.body) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["body"],
          message: "`body` must not be provided when using `template_id`",
        });
      }
    }

    // 5. If template_id is NOT present: body is required, data is not allowed
    if (!isTemplate) {
      if (!data.body && data.type !== "1") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["body"],
          message: "`body` is required when not using `template_id` and `type` is not '1'",
        });
      }
      if (data.data) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["data"],
          message: "`data` must not be provided unless using `template_id`",
        });
      }
    }
  }).strict(); // ❗ Disallow unknown top-level keys




export type NotificationBody = z.infer<typeof notificationSchema>;