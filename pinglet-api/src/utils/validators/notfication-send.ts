import { z } from "zod";
import { NotificationPayloadSchema } from "./browser-notification";

// Icon/media schema
const iconSchema = z.string().superRefine((data, ctx) => {
  if (typeof data === "string" && data.startsWith("http")) {
    ctx.addIssue({
      path: ["icon"],
      code: z.ZodIssueCode.custom,
      message: "Icons must not use a URL. Provide a local text,svg,base64 or inline value instead.",
    });
  }
});
const logoSchema = z.string().superRefine((data, ctx) => {
  if (typeof data === "string" && data.startsWith("http")) {
    ctx.addIssue({
      path: ["logo"],
      code: z.ZodIssueCode.custom,
      message: "Logo must provide a valid URL or base64.",
    });
  }
});
const mediaSchema = z
  .object({
    type: z.enum(["image", "video", "audio", "iframe"]),
    src: z.any().optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (!data.src || typeof data.src !== "string" || !/^https?:\/\//.test(data.src)) {
      ctx.addIssue({
        path: ["src"],
        code: z.ZodIssueCode.custom,
        message: "Media types must provide a valid URL or base64.",
      });
    }
  });
// Buttons schema
const baseButtonSchema = z.object({
  text: z.string(),
  action: z.enum(["redirect", "link", "alert", "event", "reload", "close", "onClick"]),
});


const buttonReloadOrClose = baseButtonSchema.extend({
  action: z.enum(["reload", "close"]),
});
const buttonWithOnClick = baseButtonSchema.extend({
  action: z.literal("onClick"),
  onClick: z.string(),
});
const buttonWithOnAlert = baseButtonSchema.extend({
  action: z.literal("alert"),
  src: z.string(),
});
const buttonWithSrc = baseButtonSchema.extend({
  action: z.enum(["redirect", "link"]),
  src: z.string().url(),
});

const buttonWithEvent = baseButtonSchema.extend({
  action: z.literal("event"),
  event: z.string(),
  data: z.any().optional(),
});

export const buttonSchema = z.discriminatedUnion("action", [
  buttonReloadOrClose,
  buttonWithSrc,
  buttonWithEvent,
  buttonWithOnClick,
  buttonWithOnAlert
]);
export const buttonsArraySchema = z.array(buttonSchema);
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
  projectId: z.string().length(24),
  type: z.union([z.literal("-1"), z.literal("0"), z.literal("1")]),
  variant: z.string().optional(),
  template_id: z.string().optional(),
  tag: z.string().optional(),
  overrides: overridesSchema.optional(),
  body: z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    media: mediaSchema.optional(),
    buttons: z.array(buttonSchema)  .max(2, 'Maximum 2 actions allowed').optional(),
    icon: iconSchema.optional(),
    logo: logoSchema.optional(),
    url: z.string().url().optional(),
  }).optional(), // for type 0
  data:  NotificationPayloadSchema.optional(), // for type -1
  custom_template: z.record(z.any(), z.any()).optional() // for type 1
})
  .superRefine((data, ctx) => {
    const isTemplate = data.template_id !== undefined;
    const isVariant = data.variant !== undefined;

    if (data.type === "1" || data?.custom_template) {
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
    if (data.type === "1" && data?.body) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["body"],
        message: "`body` is not required when type is '1'",
      });
    }
   
    // 2. If type is not "1", template_id must not be present
    if (data.type !== "1" && isTemplate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["template_id"],
        message: "`template_id` must not be provided unless type is '1'",
      });

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
      if (!data?.custom_template) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["custom_template"],
          message: "`custom_template` is required when using `template_id`",
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

    // 5. If template_id is NOT present: body is required,custom_template, data is not allowed
    if (!isTemplate) {
      if (!data.body && data.type === "0") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["body"],
          message: "`body` is required when not using `template_id` and `type` is  '0'",
        });
      }


      if (data.custom_template) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["data"],
          message: "`data` must not be provided unless using `template_id`",
        });
      }
    }
    // 6. If type is "-1", data is required
    if (data.type === "-1" && !data.data) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["data"],
        message: "`data` is required when type is '-1'",
      });
    }


  }).strict(); // ❗ Disallow unknown top-level keys



export type ButtonsSchema = z.infer<typeof buttonSchema>;
export type NotificationBody = z.infer<typeof notificationSchema>;